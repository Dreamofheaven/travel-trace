import jwt
import os
import requests
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from accounts.serializers import *
from accounts.models import Bookmark, Notification
from articles.models import Article
from traveltrace.settings import SECRET_KEY
from django.contrib.auth import get_user_model


User = get_user_model()

class SignUpView(APIView):
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
    permission_classes = [IsAuthenticated]
    # 조회
    def get(self, request, user_pk):
        user = get_object_or_404(User, pk=user_pk)
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)

    # 수정
    def put(self, request, user_pk):
        user = get_object_or_404(User, pk=user_pk)
        if user != request.user:
            return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    

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
        is_followed = True

        return Response({
            'message': f'You are now following {target_user.username}',
            'is_followed': is_followed,
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
        is_followed = False
        return Response({
            'message': f'You have unfollowed {target_user.username}.',
            'is_followed': is_followed,
            },
            status=status.HTTP_200_OK)


class NotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        followings = user.followings.values_list('id', flat=True)
        notifications = Notification.objects.filter(from_user__in=followings, article__user=user)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

    def post(self, request):
        user = request.user
        # 유저의 팔로워를 모두 조회한다.
        followings = user.followings.all()
        for following in followings:
            notifications = Notification.objects.filter(from_user=following, article__user=following)
            for notification in notifications:
                serializer = NotificationSerializer(data={
                    'to_user': request.user.id,
                    'from_user': notification.from_user.id,
                    'article': notification.article.id,
                })
                if serializer.is_valid(raise_exception=True):
                    saved_notification = serializer.save()
                    serialized_data = NotificationSerializer(saved_notification).data
                    return Response(serialized_data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_201_CREATED)            


# class NotificationDetailView(APIView):
#     def get(self, request, pk):
#         try:
#             notification = Notification.objects.get(pk=pk)
#         except Notification.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)
#         serializer = NotificationDetailSerializer(notification)
#         return Response(serializer.data)

#     def delete(self, request, pk):
#         try:
#             notification = Notification.objects.get(pk=pk)
#         except Notification.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)
#         notification.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


class UserLocationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        client_id = os.environ.get('SOCIAL_AUTH_KAKAO_CLIENT_ID')
        user = request.user
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        
        if not all([latitude, longitude]):
            return Response({"error": "latitude and longitude should be provided"}, status=status.HTTP_400_BAD_REQUEST)

        # 카카오 API를 이용해 현재 위치 정보를 받아옴
        headers = {'Authorization': f'KakaoAK {client_id}'}
        url = f'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x={longitude}&y={latitude}'
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return Response({
                'error': 'failed to retrieve location information from Kakao API'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 위치 정보 중 시/도 정보를 추출하여 유저 모델에 저장
        location = response.json().get('documents')[0].get('region_1depth_name')
        user.location = location
        user.save()

        return Response({'message': 'location saved successfully.',
                        'location': location,
                        'user_id': user.pk,
                        'username': user.username
                        },
                        status=status.HTTP_200_OK)

