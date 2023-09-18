import jwt, os, requests
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from accounts.serializers import *
from accounts.models import Bookmark, Notification
from articles.models import Article
from traveltrace.settings import SECRET_KEY
from django.contrib.auth import get_user_model

User = get_user_model()

class UserLocationView(APIView):
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
        
        data = response.json().get('documents')
        if data:
            latitude = data[0].get('y')
            longitude = data[0].get('x')

            user.location = location
            user.user_latitude = latitude
            user.user_longitude = longitude
            user.save()

            return Response({
                'message': '장소 저장에 성공하였습니다',
                'user_latitude': latitude,
                'user_longitude': longitude,
                'location': location,
                'user_id': user.pk,
                'username': user.username
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': '제공된 입력에 대한 위치 데이터를 찾을 수 없습니다.'
            }, status=status.HTTP_404_NOT_FOUND)


class MyArticleListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MyArticleSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Article.objects.filter(user=user)
        return queryset


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


## 쓸일이 있을지 미지수라 우선 주석처리함
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