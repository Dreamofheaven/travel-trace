from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Bookmark, Notification
from articles.models import Article
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'profile_img', 'info', 'location']

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
        read_only_fields = ['id']


class UserProfileSerializer(serializers.ModelSerializer):
    followers = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    followings = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    articles = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    bookmarks = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_img', 'followings', 'followers', 'info', 'articles', 'bookmarks']
        read_only_fields = ['id', 'username', 'email']


class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class NotificationDetailSerializer(serializers.ModelSerializer):
    follower = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    article = serializers.PrimaryKeyRelatedField(queryset=Article.objects.all())

    class Meta:
        model = Notification
        fields = '__all__'