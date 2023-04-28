from django.urls import path
from . import views
from accounts.views import signup_view

urlpatterns = [
    path('api/signup/', signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
]