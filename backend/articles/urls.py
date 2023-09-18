from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers

router = routers.SimpleRouter()
router.register('articles', ArticleViewSet)

urlpatterns = router.urls + [
    path('articles/<int:article_pk>/likes/',ArticleLikeAPIView.as_view()),
    path('articles/<int:article_pk>/comments/', CommentListCreateAPIView.as_view()),
    path('articles/<int:article_pk>/comments/<int:comment_pk>/', CommentDetailAPIView.as_view()),
    path('articles/<int:article_pk>/comments/<int:comment_pk>/likes/',like_comment),

    # path('<int:article_pk>/location/', ArticleLocationView.as_view()),
    # path('nearby/', NearbArticleListView.as_view()), 
    # path('upload_image/', upload_image),

]
