import jwt, os, requests
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404
from accounts.serializers import *
from accounts.models import Bookmark
from articles.models import Article
from traveltrace.settings import SECRET_KEY
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password

User = get_user_model()

class BookmarkListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookmarks = Bookmark.objects.filter(user=request.user)
        serializer = BookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data)
    

class BookmarkView(APIView):
    permission_classes = [IsAuthenticated]

    def get_is_bookmarked(self, request, article_pk):
        if not request.user.is_authenticated:
            return False
        return Bookmark.objects.filter(user=request.user, article__pk=article_pk).exists()
    
    def get(self, request, article_pk):
        is_bookmarked = self.get_is_bookmarked(request, article_pk)
        return Response({
            'is_bookmarked': is_bookmarked,
        }, status=status.HTTP_200_OK)

    def post(self, request, article_pk):
        article = get_object_or_404(Article, pk=article_pk)
        bookmark, created = Bookmark.objects.get_or_create(user=request.user, article=article)

        if created:
            is_bookmarked = True
            return Response({
                'message': f'게시글 {bookmark.article.pk}번 {bookmark.article.title}을 북마크했습니다.',
                'is_bookmarkded': is_bookmarked,
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'message': 'Already bookmarked.'
            },
            status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, article_pk):
        article = get_object_or_404(Article, pk=article_pk)
        bookmark, created = Bookmark.objects.get_or_create(user=request.user, article=article)

        if not created:
            bookmark.delete()
            is_bookmarked = False
            return Response({
                'message': f'게시글 {bookmark.article.pk}번 {bookmark.article.title}을 북마크 해제했습니다.',
                'is_bookmarkded': is_bookmarked,
            }, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({
                'message': 'Bookmark does not exist.'
            },
            status=status.HTTP_400_BAD_REQUEST)
    

# class BookmarkView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, article_pk):
#         is_bookmarked = self.get_is_bookmarked(request, article_pk)
#         return Response({
#             'is_bookmarked': is_bookmarked,
#         }, status=status.HTTP_200_OK)

#     def get_is_bookmarked(self, request, article_pk):
#         if not request.user.is_authenticated:
#             return False
#         return Bookmark.objects.filter(user=request.user, article__pk=article_pk).exists()

#     def post(self, request, article_pk):
#         '''
#         게시글에 해당 유저의 북마크가 있는지 없는지 확인한다.
#         get_or_create: 장고 쿼리셋 api 중 하나. 이미 있는 객체라면 가져오고 없으면 생성하라.
#         get_or_create()는 두 개의 값을 리턴합니다. 첫 번째 값은 해당 조건으로 필터링한 객체를 리턴하며, 두 번째 값은 객체가 새로 생성되었는지 아닌지를 나타내는 boolean 값입니다
#         '''
#         article = get_object_or_404(pk=article_pk)
#         bookmark, created = Bookmark.objects.get_or_create(user=request.user, article=article)
#         serializer = BookmarkSerializer(bookmark, context={'request': request})

#         # 없을 경우, 새로운 북마크를 생성한다.
#         if created:
#             article.is_bookmarked = True
#             article.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         # 있을 경우, 아무런 행동도 취하지 않는다.
#         else:
#             return Response({
#                 'message': 'already exists'
#             },
#             status=status.HTTP_200_OK)

#     def delete(self, request, article_pk):
#         # 해당 게시글 조회
#         article = Article.objects.get(pk=article_pk)
#         # 해당 게시글 & 해당 유저의 북마크 지우기
#         Bookmark.objects.filter(user=request.user, article=article).delete()
#         # 해당 게시글의 북마크 상태를 업데이트한다.
#         article.is_bookmarked = False
#         article.save()
#         return Response(status=status.HTTP_204_NO_CONTENT)