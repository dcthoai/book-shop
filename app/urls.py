
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="home"),
    path('register/', views.register, name="register"),
    path('verify/', views.verify, name="verify"),
    path('login/', views.signIn, name="login"),
    path('logout/', views.signOut, name="logout"),
    path('account/', views.account, name="account"),
    path('cart/', views.cart, name="cart"),
    path('book/<str:slugName>/', views.book, name='book'),
    path('payment/', views.payment, name="payment"),
    path('update_item/', views.updateItem, name="update_item"),
    path('search/<str:query>/', views.search, name='search'),
]