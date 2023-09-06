from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

User = get_user_model()

class FollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        user = request.user
        if user.username == username:
            return Response({'message': 'You cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)
        
        target_user = get_object_or_404(User, username=username)

        if user.followings.filter(username=username).exists():
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

    def delete(self, request, username):
        user = request.user
        if user.username == username:
            return Response({'message': 'You cannot unfollow yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        target_user = get_object_or_404(User, username=username)

        # 이미 언팔로우한 상태인 경우 에러 처리
        if not user.followings.filter(username=username).exists():
            return Response({
                'message': 'You are not following this user.'},
                status=status.HTTP_400_BAD_REQUEST)

        user.followings.remove(target_user)
        is_followed = False

        return Response({
            'message': f'You have unfollowed {target_user.username}.',
            'is_followed': is_followed,
            },
            status=status.HTTP_204_NO_CONTENT)