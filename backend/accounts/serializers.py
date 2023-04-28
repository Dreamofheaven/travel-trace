from rest_framework import serializers
from .models import User

# 유저 리스트
class UserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2', 'created_at', 'updated_at']
    