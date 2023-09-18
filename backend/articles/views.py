from .serializers import *
from .models import Article, Comment, Image
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from django.db.models import Count
from django.db import models

# # 로그인한 유저 토큰
# from rest_framework.authtoken.models import Token
# from rest_framework.exceptions import AuthenticationFailed

# 장소 GPS 연동
import os
import requests
from rest_framework import generics
from django.db.models.functions import Sqrt, Cast
from django.db.models import F

# 다중 이미지
from django.http import QueryDict

# 카테고리 정렬
# from rest_framework import filters
from django.http import Http404
from django_filters.rest_framework import DjangoFilterBackend

# 이미지 관련
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from django.utils import timezone
from django.core.files.storage import default_storage


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'list':
            return ArticleListSerializer
        else:
            return ArticleSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        sort = self.request.query_params.get('sort')
        user = self.request.user

        if sort == 'newest':
            queryset = queryset.order_by('-created_at')
        elif sort == 'views':
            queryset = queryset.order_by('-views')
        elif sort == 'likes':
            queryset = queryset.annotate(like_count=Count('like_users')).order_by('-like_count')
        elif sort == 'nearby':
            if not user.user_latitude or not user.user_longitude:
                return Response({'detail': 'User location is not available.'}, status=status.HTTP_400_BAD_REQUEST)
            user_latitude = user.user_latitude
            user_longitude = user.user_longitude
            queryset = queryset.exclude(latitude=None).exclude(longitude=None)
            queryset =queryset.annotate(
                    distance=Cast(Sqrt(
                        (F('latitude') - float(user_latitude)) ** 2 +
                        (F('longitude') - float(user_longitude)) ** 2
                    ), output_field=models.DecimalField())
                ).order_by('distance')            

        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if self.request.user.is_authenticated:
            # 동시성을 고려하여 db의 원자성 보존위해 F함수 사용
            # 추후에 세션을 이용해서 하루에 한 번만으로 수정해볼 예정
            Article.objects.filter(pk=instance.pk).update(views=F('views') + 1)
        serializer = self.get_serializer(instance)

        return Response(serializer.data)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ArticleLikeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, article_pk):
        article = get_object_or_404(Article, pk=article_pk)
        user = request.user
        is_liked = user in article.like_users.all()
        return Response({'is_liked': is_liked})
    
    def post(self, request, article_pk):
        article = get_object_or_404(Article, pk=article_pk)
        user = request.user
        if user in article.like_users.all():
            return Response({
                'message': 'already exists'
            },
            status=status.HTTP_200_OK)

        else:
            article.like_users.add(user)
            is_liked = True
        return Response({'is_liked': is_liked})

    def delete(self, request, article_pk):
        article = get_object_or_404(Article, pk=article_pk)
        user = request.user
        if user in article.like_users.all():
            article.like_users.remove(user)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


class CommentListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def get_queryset(self):
        article_pk = self.kwargs['article_pk']
        article = get_object_or_404(Article, pk=article_pk)
        queryset = Comment.objects.filter(article=article)
        return queryset
    
    def perform_create(self, serializer):
        article_pk = self.kwargs['article_pk']
        article = get_object_or_404(Article, pk=article_pk)
        serializer.save(user=self.request.user, article=article)


class CommentDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    lookup_url_kwarg = 'comment_pk'


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_comment(request, article_pk, comment_pk):
    comment = Comment.objects.get(pk=comment_pk)
    user = request.user
    if user in comment.like_users.all():
        comment.like_users.remove(user)
        is_liked = False
    else:
        comment.like_users.add(user)
        is_liked = True
    serializer = CommentSerializer(comment)
    return Response({'is_liked': is_liked, 'comment': serializer.data})


# @api_view(['POST'])
# def upload_image(request):
#     file_urls = []
#     for image in request.FILES.getlist('image'):
#         path = f'articles/{timezone.now().strftime("%Y/%m/%d/")}{image.name}'
#         default_storage.save(path, image)
#         file_urls.append(request.build_absolute_uri(default_storage.url(path)))
#     return Response({'fileUrls': file_urls})

# class NearbArticleListView(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self, request):
#         # 로그인한 사용자를 가져옵니다.
#         user = request.user

#         # 사용자가 위치 정보를 등록하지 않았을 경우 예외 처리합니다.
#         if not user.user_latitude or not user.user_longitude:
#             return Response({'detail': 'User location is not available.'}, status=status.HTTP_400_BAD_REQUEST)
        
#         user_latitude = user.user_latitude
#         user_longitude = user.user_longitude
#         # 게시글 중 위도와 경도가 모두 null이 아닌 것을 필터링해서 가져옵니다.
#         articles = Article.objects.exclude(latitude=None).exclude(longitude=None)
        
#         # 현재 유저의 위치를 기준으로 각 게시글과의 거리를 계산합니다.
#         # Cast() 함수는 첫 번째 인자인 식을 두 번째 인자인 output_field 타입으로 형변환해줍니다.
#         articles = articles.annotate(
#             distance=Cast(Sqrt(
#                 (F('latitude') - float(user_latitude)) ** 2 +
#                 (F('longitude') - float(user_longitude)) ** 2
#             ), output_field=models.DecimalField())
#         ).order_by('distance')

#         # 이미지 경로 앞에 'http://127.0.0.1:8000'를 추가합니다.
#         for article in articles:
#             images = article.images.all()
#             if images.exists():
#                 article.image = f"http://127.0.0.1:8000{images[0].image.url}"
        
#         serializer = ArticleListSerializer(articles, many=True)
#         return Response(serializer.data)