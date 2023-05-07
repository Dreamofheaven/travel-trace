from django.db import models
from django.conf import settings

# 카테고리
class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name
    
class Article(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='articles')
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # 좋아요 기능
    like_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='like_articles')
    # 평점 (1점 단위로 5점까지부여) 
    rating = models.DecimalField(max_digits=1, decimal_places=0, default=0)
    # 장소 및 위도 경도
    location = models.CharField(max_length=255, null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    placename = models.CharField(max_length=100, null=True, blank=True)
    # 카테고리
    category = models.CharField(max_length=100, null=False, blank=False)
    # 조회수
    views = models.IntegerField(default=0)

    # 루트
    # route = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

class Image(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='articles/%Y/%m/%d/')


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 
    like_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='like_comments')