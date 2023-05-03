from .serializers import ArticleSerializer, ArticleListSerializer, CommentSerializer
from .models import Article, Comment, Route
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
# from rest_framework.decorators import authentication_classes, permission_classes
# from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from django.db.models import Count

# # 로그인한 유저 토큰
# from rest_framework.authtoken.models import Token
# from rest_framework.exceptions import AuthenticationFailed

# 장소 GPS 연동
import os
import requests
from rest_framework.views import APIView

@api_view(['GET', 'POST'])
# @authentication_classes([SessionAuthentication, BasicAuthentication])
# @permission_classes([IsAuthenticated])
def article_list(request):
    if request.method == 'GET':
        articles = Article.objects.all()
        serializer = ArticleListSerializer(articles, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            # 게시글 저장
            article = serializer.save(user=request.user)

            # 태그 추출 및 저장
            # tags_input = request.data.get('tags', '')
            # tags_list = tags_input.split()
            # for tag_name in tags_list:
            #     tag, created = Tag.objects.get_or_create(name=tag_name)
            #     article.tags.add(tag)
            routes_input = request.data.get('routes', [])
            routes_str = ",".join(routes_input)  # 지역 목록을 문자열로 변환
            article.routes = routes_str  # routes 필드에 문자열로 저장
            article.save()  # article 저장

            routes_list = routes_input  # 문자열로 변환된 지역 목록을 사용
            for route_name in routes_list:
                route, created = Route.objects.get_or_create(name=route_name)
                article.routes.add(route)

            return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'DELETE', 'PUT'])
# @authentication_classes([SessionAuthentication, BasicAuthentication])
# @permission_classes([IsAuthenticated])
def article_detail(request, article_pk):
    article = Article.objects.get(pk=article_pk)

    if request.method == 'GET':
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
            # 수정시 평점 업데이트 전 유요성검사 실시
            if rating is not None:
                article.rating = rating
            serializer.save(user=request.user) # user 필드를 현재 사용자로 설정
            return Response(serializer.data)


@api_view(['GET'])
def comment_list(request):
    comments = Comment.objects.all()
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)


@api_view(['POST'])
# @authentication_classes([SessionAuthentication, BasicAuthentication])
# @permission_classes([IsAuthenticated])
def comment_create(request, article_pk):
    article = Article.objects.get(pk=article_pk)
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save(article=article)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'DELETE', 'PUT'])
# @authentication_classes([SessionAuthentication, BasicAuthentication])
# @permission_classes([IsAuthenticated])
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

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def like_article(request, article_pk):
    article = Article.objects.get(pk=article_pk)
    user = request.user
    if user in article.like_users.all():
        article.like_users.remove(user)
        is_liked = False
    else:
        article.like_users.add(user)
        is_liked = True
    serializer = ArticleSerializer(article)
    return Response({'is_liked': is_liked, 'article': serializer.data})

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def like_comment(request, comment_pk):
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

# 정렬 ( 좋아요 순, 최신순, 조회순 )
class ArticleViewSet(viewsets.ModelViewSet):
    serializer_class = ArticleSerializer

    def get_queryset(self):
        # 요청하는 쿼리 파라미터에서 sort 값을 가져옴
        sort = self.request.query_params.get('sort')
        # Article 모델 전체 쿼리셋을 변수에 저장
        queryset = Article.objects.all()

        # 정렬 기준에 따라 
        if sort == 'likes':
            queryset = queryset.annotate(like_count=Count('like_users')).order_by('-like_count')
        elif sort == 'newest':
            queryset = queryset.order_by('-created_at')
        elif sort == 'views':
            queryset = queryset.order_by('-views')
        return queryset

#

@api_view(['POST'])
def routes(request, article_pk):
    article = get_object_or_404(Article, pk=article_pk)
    route_names = request.data.get('routes', [])  # 지역 이름 리스트를 받음

    for route_name in route_names:
        if route_name:
            route, created = Route.objects.get_or_create(name=route_name)
            article.routes.add(route)

    return Response({'message': 'Routes added successfully.'}, status=status.HTTP_200_OK)

class ArticleLocationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        location = request.data.get('location')

        if not location:
            return Response({"error":"장소를 입력해주세요."},status=status.HTTP_400_BAD_REQUEST)
        
        # 카카오 API 를 이용해 입력받은 장소의 좌표 정보를 받아옴
        client_id = os.environ.get('SOCIAL_AUTH_KAKAO_CLIENT_ID')
        headers = {'Authorization':f'KakaoAK {client_id}'}
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

            article = Article()
            article.user = user
            article.location = location
            article.latitude = latitude
            article.longitude = longitude
            article.save()

            return Response({
                'message': '장소 저장에 성공하였습니다',
                'latitude': latitude,
                'longitude': longitude,
                'location': location,
                'article_id': article.pk,
                'user_id': user.pk,
                'username': user.username
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': '제공된 입력에 대한 위치 데이터를 찾을 수 없습니다.'
            }, status=status.HTTP_404_NOT_FOUND)
        