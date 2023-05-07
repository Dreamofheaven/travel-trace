from rest_framework import serializers
from .models import Comment, Article,Image
from rest_framework.response import Response


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('image',)

class ArticleListSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField()
    views = serializers.IntegerField()
    username = serializers.SerializerMethodField()
    images = ImageSerializer(many=True)

    def get_like_count(self, instance):
        return instance.like_users.count()

    def get(self, request):
        articles = Article.objects.all()
        sort_category = request.query_params.get('sort_category', None)
        if sort_category:
            articles = Article.get_articles_by_category(sort_category)

        serializer = ArticleListSerializer(articles, many=True)
        return Response(serializer.data)
    
    class Meta:
        model = Article
        fields = ('user', 'username', 'id', 'title','content','location', 'rating','category','like_count','views', 'images')
        read_only_fields = ('user', 'location', 'latitude', 'logitude')

    def get_username(self, obj):
        return obj.user.username



class ArticleSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, required=False)
    views = serializers.IntegerField(read_only=True)
    username = serializers.SerializerMethodField()
    class CommentInArticleSerializer(serializers.ModelSerializer):
        user = serializers.CharField(source='user.username')
        created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
        class Meta:
            model = Comment
            fields = ('id', 'user', 'content', 'created_at')
            read_only_fields = ('user',)

    comment_set = CommentInArticleSerializer(many=True, read_only=True)
    comment_count = serializers.IntegerField(source='comment_set.count', read_only=True)

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        article = Article.objects.create(**validated_data)
        # route = validated_data.pop('route', '')


        # routes = route.split(',')  # route 값을 쉼표(,)로 분리하여 리스트로 저장
        # for route_value in routes:
        #     article.route = route_value.strip()  # 공백 제거한 후 각각의 route 값 저장
        #     article.save()
        
        content = validated_data.get('content')
        tags = self.extract_tags(content)
        validated_data['tags'] = tags

        # 이미지 생성 시 중복 URL 체크
        existing_images = set()
        for image_data in images_data:
            image_url = image_data.get('image')
            if image_url not in existing_images:
                existing_images.add(image_url)
                Image.objects.create(article=article, image=image_url)

        # article.route = route
        article.save()

        return article
    
    def extract_tags(self, content):
        words = content.split()
        tags = [word.strip('#') for word in words if word.startswith('#')]
        return tags

    class Meta:
        model = Article
        fields = '__all__'
        read_only_fields = ('like_users', 'latitude', 'logitude', 'user',)
    
    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', [])

        # 이미지 처리
        existing_images = set()
        for image_data in images_data:
            image_url = image_data.get('image')
            if image_url not in existing_images:
                existing_images.add(image_url)
                Image.objects.create(article=instance, image=image_url)
        # route = validated_data.get('route')
        # instance.route = route

        # 나머지 필드 업데이트
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.rating = validated_data.get('rating', instance.rating)
        instance.category = validated_data.get('category', instance.category)
        instance.save()

        content = validated_data.get('content')
        tags = self.extract_tags(content)
        instance.tags = tags

        instance.save()

        return instance
    # 게시글 좋아요 횟수 반환
    def get_like_count(self,instance):
        return instance.like_users.count()
    
    def get_username(self, obj):
        return obj.user.username
    
class CommentSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField()
    # user = serializers.CharField(source='user.username')

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('article', 'like_users', 'like_count')

    # 댓글 좋아요 횟수 반환
    def get_like_count(self, instance):
        return instance.like_users.count()


