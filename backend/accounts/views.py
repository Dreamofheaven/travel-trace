import jwt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .serializers import *
from .models import User, Bookmark
from articles.models import Article
from traveltrace.settings import SECRET_KEY


class SignUpView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = TokenObtainPairSerializer.get_token(user)
            refresh_token = str(token)
            access_token = str(token.access_token)
            res = Response(
                {
                    'user': serializer.data,
                    'message': 'register successs',
                    'token': {
                        "access": access_token,
                        "refresh": refresh_token,
                    },
                },
                status=status.HTTP_201_CREATED
            )
            # jwt 토큰을 쿠키에 저장
            res.set_cookie('access', access_token, httponly=True)
            res.set_cookie('refresh', refresh_token, httponly=True)
            
            return res

class UserView(APIView):
    # 유저 정보 확인
    def get(self, request):
        print(request)
        try:
            # access token을 decode 해서 유저 id 추출 => 유저 식별
            access = request.COOKIES['access']
            payload = jwt.decode(access, SECRET_KEY, algorithms=['HS256'])
            pk = payload.get('user_id')
            user = get_object_or_404(User, pk=pk)
            serializer = UserSerializer(instance=user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except(jwt.exceptions.ExpiredSignatureError):
            # 토큰 만료 시 토큰 갱신
            data = {'refresh': request.COOKIES.get('refresh', None)}
            serializer = TokenRefreshSerializer(data=data)
            if serializer.is_valid(raise_exception=True):
                access = serializer.data.get('access', None)
                refresh = serializer.data.get('refresh', None)
                payload = jwt.decode(access, SECRET_KEY, algorithms=['HS256'])
                pk = payload.get('user_id')
                user = get_object_or_404(User, pk=pk)
                serializer = UserSerializer(instance=user)
                res = Response(serializer.data, status=status.HTTP_200_OK)
                res.set_cookie('access', access)
                res.set_cookie('refresh', refresh)
                return res
            raise jwt.exceptions.InvalidTokenError

        except(jwt.exceptions.InvalidTokenError):
            # 사용 불가능한 토큰일 때
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    # 로그인(원리는 회원가입과 거의 동일)
    def post(self, request):
        user = authenticate(
            email=request.data.get('email'),
            password=request.data.get('password')
        )
        if user is not None:
            serializer = UserSerializer(user)
            # jwt 토큰 접근
            token = TokenObtainPairSerializer.get_token(user)
            refresh_token = str(token)
            access_token = str(token.access_token)
            res = Response(
                {
                    'user': serializer.data,
                    'message': 'login success',
                    'token': {
                        'access': access_token,
                        'refresh': refresh_token,
                    },
                },
            )
            # jwt 토큰 => 쿠키에 저장
            res.set_cookie('access', access_token, httponly=True)
            res.set_cookie('refresh', refresh_token, httponly=True)
            return res
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    # 로그아웃
    def delete(self, request):
        # 쿠키에 저장된 토큰 삭제하여 로그아웃 처리
        response = Response({
            'message': 'Logout success'
            }, status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie('access')
        response.delete_cookie('refresh')
        return response


class ProfileView(APIView):
    # 조회
    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)

    # 수정
    def put(self, request, username):
        user = get_object_or_404(User, username=request.user.username)
        serializers = UserProfileSerializer(user, data=request.user)
        serializers.save()
        return Response(serializers.data)
    

class BookmarkListView(APIView):
    # 북마크 리스트 조회
    def get(self, request):
        bookmarks = Bookmark.objects.filter(user=request.user)
        serializer = BookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data)
    

class BookmarkView(APIView):   
    # 북마크 생성
    def post(self, request, article_pk):
        # 북마크를 할 게시글을 조회한다.
        article = Article.object.get(pk=article_pk)

        # 게시글에 해당 유저의 북마크가 있는지 없는지 확인한다.
        # get_or_create: 장고 쿼리셋 api 중 하나. 이미 있는 객체라면 가져오고 없으면 생성하라.
        # get_or_create()는 두 개의 값을 리턴합니다. 첫 번째 값은 해당 조건으로 필터링한 객체를 리턴하며, 두 번째 값은 객체가 새로 생성되었는지 아닌지를 나타내는 boolean 값입니다
        bookmark, created = Bookmark.objects.get_or_create(user=request.user, article=article)
        serializer = BookmarkSerializer(bookmark)
        
        # 없을 경우, 새로운 북마크를 생성한다.
        if created:
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # 있을 경우, 아무런 행동도 취하지 않는다.
        else:
            return Response({
                'message': 'already exists'
            },
            status=status.HTTP_200_OK)

    def delete(self, request, article_pk):
        # 해당 게시글 조회
        article = Article.objects.get(pk=article_pk)
        # 해당 게시글 & 해당 유저의 북마크 지우기
        Bookmark.objects.filter(user=request.user, article=article).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
