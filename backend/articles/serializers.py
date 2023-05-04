from rest_framework import serializers
from .models import Comment, Article,Image


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('image',)

    # def to_representation(self, instance):
    #     return instance.image.url

class ArticleListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ('user', 'id', 'title','location', 'rating')
        read_only_fields = ('user', 'location', 'latitude', 'logitude')



class ArticleSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, required=False)

    class CommentInArticleSerializer(serializers.ModelSerializer):
        class Meta:
            model = Comment
            fields = ('id', 'content',)
            read_only_fields = ('user',)

    comment_set = CommentInArticleSerializer(many=True, read_only=True)
    comment_count = serializers.IntegerField(source='comment_set.count', read_only=True)

    class Meta:
        model = Article
        fields = '__all__'
        read_only_fields = ('like_users', 'latitude', 'logitude', 'user',)
    

    # 게시글 좋아요 횟수 반환
    def get_like_count(self,instance):
        return instance.like_users.count()
    

    def create(self, validated_data):
        images_data = self.validated_data.pop('images', [])  # 이미지 데이터를 가져옵니다.
        article = Article.objects.create(**validated_data)

        # 이미지 생성 시 중복 URL 체크
        existing_images = set()
        for image_data in images_data:
            image_url = image_data.get('image')
            if image_url not in existing_images:
                existing_images.add(image_url)
                Image.objects.create(article=article, image=image_url)

        return article



class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('article','like_users',)

    # 댓글 좋아요 횟수 반환
    def get_like_count(self,instance):
        return instance.like_users.count()