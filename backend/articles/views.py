from .serializers import *
from .models import Article, Comment, Image
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
# from rest_framework.decorators import authentication_classes, permission_classes
# from rest_framework.authentication import SessionAuthentication, BasicAuthentication
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
from rest_framework.views import APIView
from rest_framework import generics
from django.db.models.functions import Sqrt, Cast
from django.db.models import F

# 다중 이미지
from django.http import QueryDict

# 카테고리 정렬
from rest_framework import filters
from django.http import Http404

# 이미지 관련
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from django.utils import timezone
from django.core.files.storage import default_storage



class ArticleView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request):
        category_name = request.GET.get('category_name')
        sort = request.GET.get('sort')

        if category_name:
            articles = Article.objects.filter(category=category_name)
        else:
            articles = Article.objects.all()

        if sort == 'likes':
            articles = articles.annotate(like_count=Count('like_users')).order_by('-like_count')
        elif sort == 'newest':
            articles = articles.order_by('-created_at')
        elif sort == 'views':
            articles = articles.order_by('-views')

        serializer = ArticleListSerializer(articles, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ArticleSerializer(data=request.data, context={'request': request,})
        if serializer.is_valid(raise_exception=True):

            article = serializer.save(user=request.user)
            article.category = request.data.get('category')
            images = request.FILES.getlist('images') 
            for image in images:
                Image.objects.create(article=article, image=image)

            location = request.data.get('location')
            client_id = os.environ.get('SOCIAL_AUTH_KAKAO_CLIENT_ID')
            headers = {"Authorization": f"KakaoAK {client_id}"}
            url = f'https://dapi.kakao.com/v2/local/search/address.json?query={location}'
            response = requests.get(url, headers=headers)

            if response.status_code != 200:
                return Response({
                    'error': '좌표를 가져오지 못했습니다.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            data = response.json().get('documents')
            
            if data:
                article.latitude = data[0].get('y')
                article.longitude = data[0].get('x')
                article.save()

            return Response(serializer.data, status=status.HTTP_200_OK)

class ArticleListView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ArticleListSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['category']

    def get_queryset(self):
        category_name = self.kwargs.get('category_name')
        if category_name:
            # 카테고리로 필터링하여 게시글 조회
            queryset = Article.objects.filter(category=category_name)
        else:
            # 전체 게시글 조회
            queryset = Article.objects.all()

        # 좋아요, 최신, 조회순 정렬
        sort = self.request.query_params.get('sort')
        if sort == 'likes':
            queryset = queryset.annotate(like_count=Count('like_users')).order_by('-like_count')
        elif sort == 'newest':
            queryset = queryset.order_by('-created_at')
        elif sort == 'views':
            queryset = queryset.order_by('-views')

        return queryset

    def post(self, request):
        tags = request.data.get('tags', [])  # 태그 데이터를 가져옵니다.
        serializer = ArticleSerializer(data=request.data, context={'request': request, 'tags': tags})
        if serializer.is_valid(raise_exception=True):
            # 게시글 저장
            article = serializer.save(user=request.user)

            article.category = request.data.get('category')  # 카테고리 저장 추가

            # 이미지 파일 처리
            images = request.FILES.getlist('images')  # 여러 개의 이미지 파일을 받습니다.
            for image in images:
                Image.objects.create(article=article, image=image)

            location = request.data.get('location')
            # 카카오 API를 이용해 입력받은 장소의 좌표 정보를 받아옴
            client_id = os.environ.get('SOCIAL_AUTH_KAKAO_CLIENT_ID')
            headers = {"Authorization": f"KakaoAK {client_id}"}
            url = f'https://dapi.kakao.com/v2/local/search/address.json?query={location}'
            response = requests.get(url, headers=headers)

            if response.status_code != 200:
                return Response({
                    'error': '좌표를 가져오지 못했습니다.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # 좌표 정보 중에서 위도(latitude)와 경도(longitude)를 추출하여 게시글 모델에 저장
            data = response.json().get('documents')
            if data:
                latitude = data[0].get('y')
                longitude = data[0].get('x')
                article.latitude = latitude
                article.longitude = longitude
                article.save()

            return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET', 'DELETE', 'PUT'])
@permission_classes([IsAuthenticated])
def article_detail(request, article_pk):
    try:
        article = Article.objects.get(pk=article_pk)
    except Article.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        article.views += 1  # 조회수 증가
        article.save()  # 조회수 업데이트

        serializer = ArticleSerializer(article)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        article.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'PUT':
        serializer = ArticleSerializer(article, data=request.data)
        if serializer.is_valid(raise_exception=True):
            # 게시글의 평점을 업데이트
            rating = request.data.get('rating')
            article.rating = rating
            article.category = request.data.get('category') 

            # 수정시 평점 업데이트 전 유요성검사 실시
            if rating is not None:
                article.rating = rating
            

            serializer.save(user=request.user) # user 필드를 현재 사용자로 설정
            return Response(serializer.data)


@api_view(['GET'])
def comment_list(request, article_pk):
    article = get_object_or_404(Article, pk=article_pk)
    comments = Comment.objects.filter(article=article)

    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def comment_create(request, article_pk):
    article = get_object_or_404(Article, pk=article_pk)
    data = request.data.copy()
    data['user'] = request.user.id  # 사용자 ID로 변경
    data['username'] = request.user.username  # 사용자 이름 추가

    serializer = CommentSerializer(data=data)

    if serializer.is_valid():
        serializer.save(user=request.user, article=article)  # 댓글 저장

        # 생성된 댓글을 포함한 기존 댓글들을 조회
        comments = Comment.objects.filter(article=article)
        comments_serializer = CommentSerializer(comments, many=True)



        return Response(comments_serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE', 'PUT'])
# @authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def comment_detail(request, comment_pk):
    comment = Comment.objects.get(pk=comment_pk)
    if request.method == 'GET':
        serializer = CommentSerializer(comment)
        return Response(serializer.data)
    elif request.method == 'DELETE':
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save() 
            return Response(serializer.data)

class ArticleLikeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, article_pk):
        article = Article.objects.get(pk=article_pk)
        user = request.user
        is_liked = user in article.like_users.all()
        return Response({'is_liked': is_liked})
    
    def post(self, request, article_pk):
        article = Article.objects.get(pk=article_pk)
        user = request.user
        if user in article.like_users.all():
            return Response({
                'message': 'already exists'
            },
            status=status.HTTP_200_OK)

        else:
            article.like_users.add(user)
            is_liked = True
        serializer = ArticleSerializer(article)
        return Response({'is_liked': is_liked, 'article': serializer.data})

    def delete(self, request, article_pk):
        article = Article.objects.get(pk=article_pk)
        user = request.user
        if user in article.like_users.all():
            article.like_users.remove(user)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

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


@api_view(['POST'])
def upload_image(request):
    file_urls = []
    for image in request.FILES.getlist('image'):
        path = f'articles/{timezone.now().strftime("%Y/%m/%d/")}{image.name}'
        default_storage.save(path, image)
        file_urls.append(request.build_absolute_uri(default_storage.url(path)))
    return Response({'fileUrls': file_urls})

class NearbArticleListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # 로그인한 사용자를 가져옵니다.
        user = request.user

        # 사용자가 위치 정보를 등록하지 않았을 경우 예외 처리합니다.
        if not user.user_latitude or not user.user_longitude:
            return Response({'detail': 'User location is not available.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user_latitude = user.user_latitude
        user_longitude = user.user_longitude
        # 게시글 중 위도와 경도가 모두 null이 아닌 것을 필터링해서 가져옵니다.
        articles = Article.objects.exclude(latitude=None).exclude(longitude=None)
        
        # 현재 유저의 위치를 기준으로 각 게시글과의 거리를 계산합니다.
        # Cast() 함수는 첫 번째 인자인 식을 두 번째 인자인 output_field 타입으로 형변환해줍니다.
        articles = articles.annotate(
            distance=Cast(Sqrt(
                (F('latitude') - float(user_latitude)) ** 2 +
                (F('longitude') - float(user_longitude)) ** 2
            ), output_field=models.DecimalField())
        ).order_by('distance')

        # 이미지 경로 앞에 'http://127.0.0.1:8000'를 추가합니다.
        for article in articles:
            images = article.images.all()
            if images.exists():
                article.image = f"http://127.0.0.1:8000{images[0].image.url}"
        
        serializer = ArticleListSerializer(articles, many=True)
        return Response(serializer.data)
# # 정렬 ( 좋아요 순, 최신순, 조회순 )
# class ArticleViewSet(viewsets.ModelViewSet):
#     queryset = Article.objects.all()
#     serializer_class = ArticleSerializer

#     def get_queryset(self):
#         sort = self.request.query_params.get('sort')
#         queryset = super().get_queryset()

#         if sort == 'newest':
#             queryset = queryset.order_by('-created_at')
#         elif sort == 'views':
#             queryset = queryset.order_by('-views')

#         return queryset

