from django.urls import path
from . import views

urlpatterns = [
    path('login/',views.login),
    path('logout/',views.logout),
    path('signup/',views.signup),
    path('delete/',views.delete),
    path('update/',views.update),
    path('password/',views.change_password),
    path('profile/<username>/',views.profile),
    # path('<int:user_pk>/follow/',views.follow),
    # path('<int:user_pk>/like/',views.like),
    # path('<int:user_pk>/bookmark/',views.bookmark),


]
