from django.urls import path
from . import views
from accounts.views import signup

urlpatterns = [
    path('api/signup/', signup, name='signup'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
]