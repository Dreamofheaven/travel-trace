from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

urlpatterns = [
    # 회원가입, 로그인, 로그아웃
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('login/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('', UserView.as_view()),    

    # 프로필
    path('profile/<str:username>/', ProfileView.as_view(), name='profile'),
    path('profile/<str:username>/password/', ChangePasswordView.as_view(), name='change_password'),
    path('profile/<str:username>/my_article/', MyArticleListView.as_view()),
    path('profile/<str:username>/my_bookmark/', BookmarkListView.as_view()),

    # 북마크 및 팔로우
    path('<int:article_pk>/bookmark/', BookmarkView.as_view()),
    path('<str:username>/follow/', FollowView.as_view()),

    # 현위치 정보 저장
    path('current_location/', UserLocationView.as_view()),

    # 알림
    path('notifications/', NotificationView.as_view(), name='notification_list'),
    # path('notifications/<int:pk>/', views.NotificationDetailView.as_view(), name='notification_detail'),

    # 구글
    path('google/login/', google_login, name='google_login'),
    path('google/callback/', google_callback, name='google_callback'),
    path('google/login/finish/', GoogleLogin.as_view(), name='google_login_todjango'),

    # 카카오
    path('kakao/login/', kakao_login, name='kakao_login'),
    path('kakao/callback/', kakao_callback, name='kakao_callback'),
    path('kakao/login/finish/', KakaoLogin.as_view(), name='kakao_login_todjango'),

    # 네이버
    path('naver/login', naver_login, name='naver_login'),
    path('naver/callback/', naver_callback, name='naver_callback'),
    path('naver/login/finish/', NaverLogin.as_view(), name='naver_login_todjango'),

    # 토큰관련
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]