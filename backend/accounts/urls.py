from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
urlpatterns = [
    # 회원가입, 로그인, 로그아웃
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('', views.UserView.as_view()),

    # 소셜 로그인
    # path('google/login/', views.google_login, name='google_login'),
    # path('google/callback/', views.google_callback, name='google_callback'),
    path('google/login/finish/', views.GoogleLogin.as_view(), name='google_login_todjango'),

    # 프로필 및 북마크
    path('profile/<int:user_pk>/', views.ProfileView.as_view()),
    path('bookmark/my_bookmark/', views.BookmarkListView.as_view()),
    path('bookmark/<int:article_pk>/', views.BookmarkView.as_view()),
    path('follow/<int:user_pk>/', views.FollowView.as_view()),

    # 토큰관련
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]