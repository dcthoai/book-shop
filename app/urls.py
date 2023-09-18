
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="home"),
    path('register/', views.register, name="register"),
    path('login/', views.signIn, name="login"),
    path('logout/', views.signOut, name="logout"),
    path('cart/', views.cart, name="cart"),
    path('book/<str:slugName>/', views.book, name='book'),
    path('payment/', views.payment, name="payment"),
    path('update_item/', views.updateItem, name="update_item"),
]