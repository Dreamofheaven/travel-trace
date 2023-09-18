import os, requests
from rest_framework import serializers
from .models import Comment, Article,Image


class ArticleListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    article_like_count = serializers.SerializerMethodField()

    def get_image(self, instance):
        if instance.images.first():
            return f'http://127.0.0.1:8000{instance.images.first().image.url}'
        return None
    
    def get_comment_count(self, instance):
        return instance.comment_set.count()
            
    def get_article_like_count(self, instance):
        return instance.like_users.count()
    
    class Meta:
        model = Article
        fields = ('id', 'user', 'title', 'content', 'rating','category','views', 'placename', 'created_at', 'image', 'comment_count', 'article_like_count', 'location', 'latitude', 'longitude')
        read_only_fields = ('user', 'latitude', 'logitude',)


class CommentInArticleSerializer(serializers.ModelSerializer):
        user = serializers.CharField(source='user.username')
        created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')

        class Meta:
            model = Comment
            fields = ('id', 'user', 'content', 'created_at')
            read_only_fields = ('user',)


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('id', 'image')


class ArticleSerializer(serializers.ModelSerializer):
    '''
    - def create
        - 이미지 넣기
        - location 구하기
    - 댓글 리스트
    '''
    images = ImageSerializer(many=True, read_only=True, required=False)
    comment_set = CommentInArticleSerializer(many=True, read_only=True)
    like_users = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    
    comment_count = comment_count = serializers.IntegerField(source='comment_set.count', read_only=True)
    like_count = serializers.IntegerField(source='like_users.count', read_only=True)

    class Meta:
        model = Article
        fields = '__all__'
        read_only_fields = ('like_users', 'latitude', 'longitude', 'user', 'views') 
    
    def get_like_count(self, instance):
        return instance.like_users.count()
    
    def create(self, validated_data):
        article = Article.objects.create(**validated_data)
        images_data = self.context.get('request').FILES.getlist('images')

        # 이미지 생성
        for image_data in images_data:
            Image.objects.create(article=article, image=image_data)

        # 좌표 생성
        location = validated_data.get('location')
        client_id = os.environ.get('SOCIAL_AUTH_KAKAO_CLIENT_ID')
        headers = {"Authorization": f"KakaoAK {client_id}"}
        url = f'https://dapi.kakao.com/v2/local/search/address.json?query={location}'
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            raise serializers.ValidationError({'error': '좌표를 가져오지 못했습니다.'})

        data = response.json().get('documents')
        
        if data:
            article.latitude = data[0].get('y')
            article.longitude = data[0].get('x')

        article.save()

        return article
    
    def update(self, instance, validated_data):
        images_data = self.context.get('request').FILES.getlist('images')
        instance.images.all().delete()

        for image_data in images_data:
            Image.objects.create(article=instance, image=image_data)

        instance.location = validated_data.get('location', instance.location)

        location = validated_data.get('location')
        client_id = os.environ.get('SOCIAL_AUTH_KAKAO_CLIENT_ID')
        headers = {"Authorization": f"KakaoAK {client_id}"}
        url = f'https://dapi.kakao.com/v2/local/search/address.json?query={location}'
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            raise serializers.ValidationError({'error': '좌표를 가져오지 못했습니다.'})

        data = response.json().get('documents')
        
        if data:
            instance.latitude = data[0].get('y')
            instance.longitude = data[0].get('x')

        # 나머지 필드 업데이트
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.rating = validated_data.get('rating', instance.rating)
        instance.category = validated_data.get('category', instance.category)
        instance.placename = validated_data.get('placename', instance.placename)
        instance.save()

        return instance


class CommentSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField()

    def get_like_count(self, instance):
        return instance.like_users.count()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = instance.user.username
        return representation

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('article', 'like_users', 'like_count', 'user')


# class ArticleListSerializer(serializers.ModelSerializer):
#     views = serializers.IntegerField()
#     images = ImageSerializer(many=True)

#     like_count = serializers.SerializerMethodField()
#     username = serializers.SerializerMethodField()
#     image = serializers.SerializerMethodField()

#     def get_like_count(self, instance):
#         return instance.like_users.count()
    
#     def get_image(self, article):
#         if article.images.first():
#             return f"http://127.0.0.1:8000{article.images.first().image.url}"
#         return None    

#     def get_username(self, obj):
#         return obj.user.username
    
#     class Meta:
#         model = Article
#         fields = ('id', 'user', 'username', 'title','content','location', 'rating','category','like_count','views', 'images', 'image', 'placename')
#         read_only_fields = ('user', 'location', 'latitude', 'logitude', 'placename')

# class ArticleSerializer(serializers.ModelSerializer):
#     images = ImageSerializer(many=True, required=False)
#     views = serializers.IntegerField(read_only=True)
#     username = serializers.SerializerMethodField()
    
#     comment_set = CommentInArticleSerializer(many=True, read_only=True)
#     comment_count = serializers.IntegerField(source='comment_set.count', read_only=True)

#     def create(self, validated_data):
#         images_data = validated_data.pop('images', [])
#         article = Article.objects.create(**validated_data)
#         content = validated_data.get('content')
#         tags = self.extract_tags(content)
#         validated_data['tags'] = tags

#         # 이미지 생성 시 중복 URL 체크
#         existing_images = set()
#         for image_data in images_data:
#             image_url = image_data.get('image')
#             if image_url not in existing_images:
#                 existing_images.add(image_url)
#                 Image.objects.create(article=article, image=image_url)

#         article.save()

#         return article
    
#     def extract_tags(self, content):
#         words = content.split()
#         tags = [word.strip('#') for word in words if word.startswith('#')]
#         return tags

#     class Meta:
#         model = Article
#         fields = '__all__'
#         read_only_fields = ('like_users', 'latitude', 'logitude', 'user',)
    
#     def update(self, instance, validated_data):
#         images_data = validated_data.pop('images', [])

#         # 이미지 처리
#         existing_images = set()
#         for image_data in images_data:
#             image_url = image_data.get('image')
#             if image_url not in existing_images:
#                 existing_images.add(image_url)
#                 Image.objects.create(article=instance, image=image_url)
#         # route = validated_data.get('route')
#         # instance.route = route

#         # 나머지 필드 업데이트
#         instance.title = validated_data.get('title', instance.title)
#         instance.content = validated_data.get('content', instance.content)
#         instance.rating = validated_data.get('rating', instance.rating)
#         instance.category = validated_data.get('category', instance.category)
#         instance.placename = validated_data.get('placename', instance.placename)
#         instance.save()

#         content = validated_data.get('content')
#         tags = self.extract_tags(content)
#         instance.tags = tags

#         instance.save()

#         return instance

#     def get_like_count(self,instance):
#         return instance.like_users.count()
    
#     def get_username(self, obj):
#         return obj.user.username


# class ArticleListSerializer(serializers.ModelSerializer):
#     views = serializers.IntegerField()
#     images = ImageSerializer(many=True)

#     like_count = serializers.SerializerMethodField()
#     username = serializers.SerializerMethodField()
#     image = serializers.SerializerMethodField()

#     def get_like_count(self, instance):
#         return instance.like_users.count()

#     def get(self, request):
#         articles = Article.objects.all()
#         sort_category = request.query_params.get('sort_category', None)
#         if sort_category:
#             articles = Article.get_articles_by_category(sort_category)

#         serializer = ArticleListSerializer(articles, many=True)
#         return Response(serializer.data)
    
#     class Meta:
#         model = Article
#         fields = ('user', 'username', 'id', 'title','content','location', 'rating','category','like_count','views', 'images', 'image', 'placename')
#         read_only_fields = ('user', 'location', 'latitude', 'logitude', 'placename')

#         # image 필드 값 설정
#     def get_image(self, article):
#         if article.images.first():
#             return f"http://127.0.0.1:8000{article.images.first().image.url}"
#         return None    

#     def get_username(self, obj):
#         return obj.user.username