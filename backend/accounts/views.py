import jwt
import os
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from django.shortcuts import redirect
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .serializers import *
from .models import Bookmark
from articles.models import Article
from traveltrace.settings import SECRET_KEY
from django.contrib.auth import get_user_model

# 소셜로그인 관련
from json import JSONDecodeError
from django.http import JsonResponse
import requests
from allauth.socialaccount.models import SocialAccount
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.providers.google import views as google_view

User = get_user_model()
class SignUpView(APIView):
    # permission_classes = [IsAuthenticated]
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


# 소셜 로그인
# 구글 소셜로그인 변수 설정
state = os.environ.get('STATE')
BASE_URL = 'http://localhost:8000/'
GOOGLE_CALLBACK_URI = BASE_URL + 'accounts/google/callback/'

class GoogleLogin(SocialLoginView):
    adapter_class = google_view.GoogleOAuth2Adapter
    callback_url = GOOGLE_CALLBACK_URI
    client_class = OAuth2Client


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
    permission_classes = [IsAuthenticated]
    # 북마크 리스트 조회
    def get(self, request):
        bookmarks = Bookmark.objects.filter(user=request.user)
        serializer = BookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data)
    

class BookmarkView(APIView):
    permission_classes = [IsAuthenticated]   
    # 북마크 생성
    def post(self, request, article_pk):
        # 북마크를 할 게시글을 조회한다.
        article = Article.objects.get(pk=article_pk)

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
    

class FollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_pk):
        user = request.user
        if user.pk == int(user_pk):
            return Response({'message': 'You cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)
        
        target_user = get_object_or_404(User, pk=user_pk)

        if user.followings.filter(pk=user_pk).exists():
            return Response({
                'message': 'You are already following this user.'
                },
                status=status.HTTP_400_BAD_REQUEST)
        user.followings.add(target_user)

        return Response({
            'message': f'You are now following {target_user.username}'
            },
            status=status.HTTP_201_CREATED)

    def delete(self, request, user_pk):
        user = request.user
        if user.pk == int(user_pk):
            return Response({'message': 'You cannot unfollow yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        target_user = get_object_or_404(User, pk=user_pk)

        # 이미 언팔로우한 상태인 경우 에러 처리
        if not user.followings.filter(pk=user_pk).exists():
            return Response({
                'message': 'You are not following this user.'},
                status=status.HTTP_400_BAD_REQUEST)

        user.followings.remove(target_user)

        return Response({
            'message': f'You have unfollowed {target_user.username}.'},
            status=status.HTTP_200_OK)



## 하단의 주석처리한 내용은 DRF로 프+백을 동시에 할 경우 사용하는 코드 이므로 주석처리하였음. 추후 필요하다면 확인할 예정
# def google_login(request):
#     scope = 'https://www.googleapis.com/auth/userinfo.email'
#     client_id = os.environ.get('SOCIAL_AUTH_GOOGLE_CLIENT_ID')
#     return redirect(f'https://accounts.google.com/o/oauth2/v2/auth?client_id={client_id}&response_type=code&redirect_uri={GOOGLE_CALLBACK_URI}&scope={scope}')

# def google_callback(request):
#     client_id = os.environ.get('SOCIAL_AUTH_GOOGLE_CLIENT_ID')
#     client_secret = os.environ.get('SOCIAL_AUTH_GOOGLE_SECRET')
#     code = request.GET.get('code')

#     # 1. 받은 코드로 구글에 access token 요청
#     token_req = requests.post(f'https://oauth2.googleapis.com/token?client_id={client_id}&client_secret={client_secret}&code={code}&grant_type=authorization_code&redirect_uri={GOOGLE_CALLBACK_URI}&state={state}')
    
#     ### 1-1. json으로 변환 & 에러 부분 파싱
#     token_req_json = token_req.json()
#     error = token_req_json.get('error')

#     ### 1-2. 에러 발생 시 종료
#     if error is not None:
#         raise JSONDecodeError(error)

#     ### 1-3. 성공 시 access_token 가져오기
#     access_token = token_req_json.get('access_token')

#     #################################################################

#     # 2. 가져온 access_token으로 이메일값을 구글에 요청
#     email_req = requests.get(f'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={access_token}')
#     email_req_status = email_req.status_code

#     ### 2-1. 에러 발생 시 400 에러 반환
#     if email_req_status != 200:
#         return JsonResponse({'err_msg': 'failed to get email'}, status=status.HTTP_400_BAD_REQUEST)
    
#     ### 2-2. 성공 시 이메일 가져오기
#     email_req_json = email_req.json()
#     email = email_req_json.get('email')

#     # return JsonResponse({'access': access_token, 'email':email})

#     #################################################################

#     # 3. 전달받은 이메일, access_token, code를 바탕으로 회원가입/로그인
#     try:
#         # 전달받은 이메일로 등록된 유저가 있는지 탐색
#         user = User.objects.get(email=email)

#         # FK로 연결되어 있는 socialaccount 테이블에서 해당 이메일의 유저가 있는지 확인
#         social_user = SocialAccount.objects.get(user=user)
#         if social_user is None:
#             return JsonResponse({'err_msg': 'email exists but not social user'}, status=status.HTTP_400_BAD_REQUEST)
#         # 있는데 구글계정이 아니어도 에러
#         if social_user.provider != 'google':
#             return JsonResponse({'err_msg': 'no matching social type'}, status=status.HTTP_400_BAD_REQUEST)

#         # 이미 Google로 제대로 가입된 유저 => 로그인 & 해당 유저의 jwt 발급
#         data = {'access_token': access_token, 'code': code}
#         accept = requests.post(f'{BASE_URL}accounts/google/login/finish/', data=data)
#         accept_status = accept.status_code

#         # 뭔가 중간에 문제가 생기면 에러
#         if accept_status != 200:
#             return JsonResponse({'err_msg': 'failed to signin'}, status=accept_status)

#         accept_json = accept.json()
#         accept_json.pop('user', None)
#         return JsonResponse(accept_json)

#     except User.DoesNotExist:
#         # 전달받은 이메일로 기존에 가입된 유저가 아예 없으면 => 새로 회원가입 & 해당 유저의 jwt 발급
#         data = {'access_token': access_token, 'code': code}
#         accept = requests.post(f'{BASE_URL}accounts/google/login/finish/', data=data)
#         accept_status = accept.status_code

#         # 뭔가 중간에 문제가 생기면 에러
#         if accept_status != 200:
#             return JsonResponse({'err_msg': 'failed to signup'}, status=accept_status)

#         accept_json = accept.json()
#         accept_json.pop('user', None)
#         return JsonResponse(accept_json)