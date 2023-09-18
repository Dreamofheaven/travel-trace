from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from articles.models import Article
# Create your models here.

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError(_("Email should be provided"))
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        if password:
            user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_("Superuser should have is _staff as True"))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_("Superuser should have is _superuser as True"))
        if extra_fields.get('is_active') is not True:
            raise ValueError(_("Superuser should have is _active as True"))
        
        return self.create_user(email, password, **extra_fields)
        

class User(AbstractUser):
    username = models.CharField(max_length=25, unique=True)
    email = models.EmailField(max_length=80, unique=True)
    profile_img = models.ImageField(upload_to='users/%Y/%m/%d/', null=True, blank=True)
    followings = models.ManyToManyField('self', symmetrical=False, related_name='followers', blank=True)
    info = models.CharField(max_length=200, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    user_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    user_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    
    # 유저id로 email을 쓰겠다.
    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS=['username']

    objects = CustomUserManager()

    def __str__(self):
        return self.username
    

class Notification(models.Model):
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='receiving_notifications')
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sending_notifications')
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']


class Bookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookmarks')
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # 특정 모델에서 여러 필드를 결합한 유일성을 보장하기 위해 사용
        # 하나의 유저가 같은 게시글을 중복해서 북마크할 수 없도록 제한하는 역할
        unique_together = ('user', 'article',)