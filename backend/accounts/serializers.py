from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User
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
        fields = (['username', 'email', 'password', 'profile_img'])

    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data.get('username'),
            email = validated_data.get('email'),
            password = validated_data.get('password'),
        )   
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    followers = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    followings = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = User
        # 추후, 게시글, 북마크도 추가
        fields = (['username', 'email', 'profile_img', 'followings', 'followers'])
    