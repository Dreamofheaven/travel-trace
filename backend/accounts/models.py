from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import ugettext_lazy as _
# Create your models here.

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError(_("Email should be provided"))
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        # 15번 줄 동작하지 않는 것으로 보임
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
    
    # 유저id로 email을 쓰겠다.
    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS=['username']

    def __str__(self):
        return f'<User {self.email}'

