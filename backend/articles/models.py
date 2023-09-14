from django.db import models
from django.conf import settings

# 카테고리
# class Category(models.Model):
#     name = models.CharField(max_length=50)

#     def __str__(self):
#         return self.name
    
class Article(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='articles')
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    like_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='like_articles')
    rating = models.DecimalField(max_digits=1, decimal_places=0, default=0)     # 평점 (1점 단위로 5점까지부여) 
    
    location = models.CharField(max_length=255, null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    
    placename = models.CharField(max_length=100, null=True, blank=True)
    views = models.IntegerField(default=0)

    CATEGORY_CHOICES = (
        ('relax', '힐링'),
        ('tour', '관광'),
        ('food', '맛집/카페'),
        ('activity', '액티비티')
    )

    category = models.CharField(max_length=50, null=False, choices=CATEGORY_CHOICES)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.pk}: {self.title}'


class Image(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='articles/%Y/%m/%d/')


class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 
    like_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='like_comments')