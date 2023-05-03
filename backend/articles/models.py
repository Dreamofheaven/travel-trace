from django.db import models
from django.conf import settings

# Create your models here.
# 태그
class Tag(models.Model):
    name = models.CharField(max_length=255)

# 여행루트
class Route(models.Model):
    name = models.CharField(max_length=255)

class Article(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='articles')
    title = models.CharField(max_length=100)
    image = models.ImageField(blank=True, upload_to='articles/%Y/%m/%d/')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # 좋아요
    like_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='like_articles')
    # 평점 (1점 단위로 5점까지부여) 
    rating = models.DecimalField(max_digits=1, decimal_places=0, default=0)
    # 태그 
    # tags = models.ManyToManyField(Tag)
    location = models.CharField(max_length=255, null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)




class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 
    like_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='like_comments')