import jwt, os, requests
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404
from accounts.serializers import *
from accounts.models import Bookmark, Notification
from articles.models import Article
from traveltrace.settings import SECRET_KEY
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password

User = get_user_model()

class SignUpView(APIView):
    permission_classes = [ AllowAny ]
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()

            if user:   
                return Response(
                    {
                        'user': serializer.data,
                        'message': 'register successs',
                    },
                    status=status.HTTP_201_CREATED
                )

class LoginView(APIView):
    def post(self, request):
        user = authenticate(
            email=request.data.get('email'),
            password=request.data.get('password')
        )
        if user:
            serializer = UserSerializer(user)
            token = TokenObtainPairSerializer.get_token(user)
            refresh_token = str(token)
            access_token = str(token.access_token)

            response = Response(
                {
                    'user': serializer.data,
                    'message': 'Login success',
                    "token": {
                        "access": access_token,
                        "refresh": refresh_token,
                    },
                },
                status=status.HTTP_200_OK,
            )

            response.set_cookie("access", access_token, httponly=True)
            response.set_cookie("refresh", refresh_token, httponly=True)

            return response
        else:
            return Response({ 'message': 'Login failed' }, status=status.HTTP_400_BAD_REQUEST)
        

class LogoutView(APIView):
    def delete(self, request):
        permission_classes = [ IsAuthenticated ]        
        response = Response({
            'message': 'Logout success'
            }, status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie('access')
        response.delete_cookie('refresh')
        
        return response
    

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    # 조회
    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        serializer = UserProfileSerializer(user)
        return Response({
            'data': serializer.data,
            'message': '조회 완료',
        }, status=status.HTTP_200_OK)

    # 수정
    def patch(self, request, username):
        user = get_object_or_404(User, username=username)
        if user != request.user:
            return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'data': serializer.data,
            'message': '수정 완료',
        }, status=status.HTTP_200_OK)
    
    def delete(self, request, username):
        user = get_object_or_404(User, username=username)
        if user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        confirm_message = "회원탈퇴를 진행하시려면 '확인완료'를 입력하세요."
        if request.data.get('confirmation') != '확인완료':
            return Response({'message': confirm_message}, status=status.HTTP_400_BAD_REQUEST)
        
        user.delete()

        return Response({
            'message': '회원탈퇴가 성공적으로 이뤄졌습니다.',
        }, status=status.HTTP_204_NO_CONTENT) 
    

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, username):
        user = get_object_or_404(User, username=username)
        if user != request.user:
            return Response({'detail': '이 작업을 수행할 권한이 없습니다.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ChangePasswordSerializer(data=request.data)
        print(serializer)

        if serializer.is_valid(raise_exception=True):
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not check_password(old_password, user.password):
                return Response({
                    'error': '기존 비밀번호가 일치하지 않습니다.',
                }, status=status.HTTP_400_BAD_REQUEST)
        
            user.set_password(new_password)
            user.save()

            return Response({'message': '비밀번호가 성공적으로 변경되었습니다.'}, status=status.HTTP_200_OK)

        # if not old_password or not new_password or not new_confirm_password:
        #     return Response({
        #         'error': '필수입력 누락',
        #     }, status=status.HTTP_400_BAD_REQUEST)
        

class UserView(APIView):
    # 유저 정보 확인
    def get(self, request):
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




    # def post(self, request):
    #     client_id = os.environ.get('SOCIAL_AUTH_KAKAO_CLIENT_ID')
    #     user = request.user
    #     latitude = request.data.get('latitude')
    #     longitude = request.data.get('longitude')
        
    #     if not all([latitude, longitude]):
    #         return Response({"error": "latitude and longitude should be provided"}, status=status.HTTP_400_BAD_REQUEST)

    #     # 카카오 API를 이용해 현재 위치 정보를 받아옴
    #     headers = {'Authorization': f'KakaoAK {client_id}'}
    #     url = f'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x={longitude}&y={latitude}'
    #     response = requests.get(url, headers=headers)
    #     if response.status_code != 200:
    #         return Response({
    #             'error': 'failed to retrieve location information from Kakao API'
    #             },
    #             status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    #     # 위치 정보 중 시/도 정보를 추출하여 유저 모델에 저장
    #     location = response.json().get('documents')[0].get('region_1depth_name')
    #     user.location = location
    #     user.save()

    #     return Response({'message': 'location saved successfully.',
    #                     'location': location,
    #                     'user_id': user.pk,
    #                     'username': user.username
    #                     },
    #                     status=status.HTTP_200_OK)

