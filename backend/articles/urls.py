from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', views.article_list),
    path('<int:article_pk>/', views.article_detail),
    path('comments/', views.comment_list),
    path('comments/<int:comment_pk>/', views.comment_detail),
    path('<int:article_pk>/comments/', views.comment_create),

    path('<int:article_pk>/likes/',views.like_article),

    path('comments/<int:comment_pk>/likes/',views.like_comment),

    # 정렬
    # path('articles/', ArticleViewSet.as_view({'get': 'list'}), name='article-list'),
    # path('<int:article_pk>/routes/', views.routes),
    # path('<int:article_pk>/location/', views.ArticleLocationView.as_view()),
    path('nearby/', views.NearbArticleListView.as_view()), 
 

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
