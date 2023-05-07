from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', views.ArticleListView.as_view()),
    # path('', views.ArticleViewSet.as_view({'get': 'list', 'post': 'create'}), name='article-list'),
    path('<int:article_pk>/', views.article_detail),
    path('<int:article_pk>/comments/', views.comment_list),
    path('<int:article_pk>/comments/<int:comment_pk>/', views.comment_detail),
    path('<int:article_pk>/comments/create/', views.comment_create),

    path('<int:article_pk>/likes/',views.like_article),

    path('<int:article_pk>/comments/<int:comment_pk>/likes/',views.like_comment),

    # path('<int:article_pk>/location/', views.ArticleLocationView.as_view()),
    path('nearby/', views.NearbArticleListView.as_view()), 
    path('upload_image/', views.upload_image, name='upload_image'),
    path('<str:category_name>/', views.ArticleListView.as_view(), name='category_article_list'),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
