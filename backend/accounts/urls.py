from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
urlpatterns = [
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('', views.UserView.as_view()),
    path('profile/<str:username>/', views.ProfileView.as_view()),
    path('bookmark/my_bookmark/', views.BookmarkListView.as_view()),
    path('bookmark/<int:article_pk>/', views.BookmarkView.as_view()),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]