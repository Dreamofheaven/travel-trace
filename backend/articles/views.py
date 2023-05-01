from .serializers import ArticleSerializer, ArticleListSerializer, CommentSerializer
from .models import Article, Comment
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated


@api_view(['GET', 'POST'])
def article_list(request):
    if request.method == 'GET':
        articles = Article.objects.all()
        serializer = ArticleListSerializer(articles, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'DELETE', 'PUT'])
def article_detail(request, article_pk):
    article = Article.objects.get(pk=article_pk)

    if request.method == 'GET':
        serializer = ArticleSerializer(article)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        article.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'PUT':
        serializer = ArticleSerializer(article, data=request.data)
        if serializer.is_valid(raise_exception=True):
            # 게시글의 평점을 업데이트
            rating = request.data.get('rating')
            article.rating = rating
            # 수정시 평점 업데이트 전 유요성검사 실시
            if rating is not None:
                article.rating = rating
            serializer.save(user=request.user) # user 필드를 현재 사용자로 설정
            return Response(serializer.data)


@api_view(['GET'])
def comment_list(request):
    comments = Comment.objects.all()
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def comment_create(request, article_pk):
    article = Article.objects.get(pk=article_pk)
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save(article=article)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'DELETE', 'PUT'])
def comment_detail(request, comment_pk):
    comment = Comment.objects.get(pk=comment_pk)
    if request.method == 'GET':
        serializer = CommentSerializer(comment)
        return Response(serializer.data)
    elif request.method == 'DELETE':
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save() 
            return Response(serializer.data)

@api_view(['POST'])
# @authentication_classes([SessionAuthentication, BasicAuthentication])
# @permission_classes([IsAuthenticated])
def like_article(request, article_pk):
    # 게시글 조회
    article = Article.objects.get(pk=article_pk)
    user = request.user # 요청을 보낸 사용자를 가져옴
    if user in article.like_users.all(): # 사용자가 이미 게시글에 좋아요를 한 경우
        article.like_users.remove(user) # 좋아요 제거
        is_liked = False # 좋아요 상태를 False 로
    else: # 반대의 경우 
        article.like_users.add(user) # 좋아요 추가
        is_liked = True # 좋아요 상태를 True 로
    serializer = ArticleSerializer(article)
    return Response({'is_liked':is_liked, 'article':serializer.data})

@api_view(['POST'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def like_comment(request, comment_pk):
    comment = Comment.objects.get(pk=comment_pk)
    user = request.user
    if user in comment.like_users.all():
        comment.like_users.remove(user)
        is_liked = False
    else:
        comment.like_users.add(user)
        is_liked = True
    serializer = CommentSerializer(comment)
    return Response({'is_liked':is_liked,'comment':serializer.data})