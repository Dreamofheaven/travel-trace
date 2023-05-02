from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Bookmark
# from articles.serializers import ArticleListSerialize

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'profile_img',]

    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data.get('username'),
            email = validated_data.get('email'),
            password = validated_data.get('password'),
            profile_img=validated_data.get('profile_img')
        )   
        user.save()
        return user
    

class FollowSerializer(serializers.ModelSerializer):
    following = UserSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_img', 'followings', 'following']

class UserProfileSerializer(serializers.ModelSerializer):
    followers = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    followings = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = User
        # 추후, 게시글, 북마크도 추가
        fields = ['username', 'email', 'profile_img', 'followings', 'followers']


class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = '__all__'
