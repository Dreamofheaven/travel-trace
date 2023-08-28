from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Bookmark, Notification
from articles.models import Article
from articles.serializers import ArticleSerializer, ImageSerializer

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
    article = ArticleSerializer()
    is_bookmarked = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request is None or not request.user.is_authenticated:
            return False
        return Bookmark.objects.filter(user=request.user, article=obj.article).exists()
    class Meta:
        model = Bookmark
        fields = '__all__'

    def get_image(self, obj):
        if obj.article.images.first():
            return f"http://127.0.0.1:8000{obj.article.images.first().image.url}"
        return None 
    
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


class MyArticleSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    class Meta:
        model = Article
        fields = '__all__'