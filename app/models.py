from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
import unidecode
import re

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(null=True, blank=True)

    @property
    def avatarURL(self):
        url = 'static/app/images/avatar-icon.png'
        try:
            url = self.avatar.url
        except:
            url = 'static/app/images/avatar-icon.png'
        return url

class Product(models.Model):
    name = models.CharField(max_length=100, null=True)
    price = models.IntegerField()
    cost = models.IntegerField()
    image = models.ImageField(null=True, blank=True)
    publisher = models.CharField(default='N/A', max_length=100, null=True, blank=True)
    author = models.CharField(default='N/A', max_length=100, null=True, blank=True)
    description = models.CharField(default='Người bán chưa cung cấp thông tin mô tả sản phẩm.', max_length=3000, null=True, blank=True)
    slugName = models.SlugField(unique=True, null=True, blank=True)
    
    def save(self, *args, **kwargs):
        if self.name:
            self.slugName = unidecode.unidecode(self.name)
            self.slugName = self.slugName.lower()
            self.slugName = re.sub(r'\W+', ' ', self.slugName)
            self.slugName = self.slugName.strip()
            self.slugName = self.slugName.replace(" ", "-")
        else:
            self.slugName = ""
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def imageURL(self):
        try:
            url = self.image.url
        except:
            url = 'static/app/images/avatar-icon.png'
        return url

class Order(models.Model):
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    dateOrder = models.DateTimeField(auto_now_add=True)
    complete = models.BooleanField(default=False, null=True, blank=False)
    transactionId = models.CharField(max_length=50, null=True)

    def __str__(self):
        return str(self.id)

    @property
    def get_cart_items(self):
        orderitems = self.orderitem_set.all()
        total = sum([item.quantity for item in orderitems])
        return total
    
    def get_cart_total(self):
        orderitems = self.orderitem_set.all()
        total = sum([item.get_total for item in orderitems])
        return total
 
class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, blank=True, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, blank=True, null=True)
    quantity = models.IntegerField(default=0, null=True, blank=True)
    dateAdded = models.DateTimeField(auto_now_add=True)

    @property
    def get_total(self):
        return self.product.price * self.quantity

class ShippingAddress(models.Model):
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, blank=True, null=True)
    address = models.CharField(max_length=250, null=True)
    phoneNumber = models.CharField(max_length=10, null=True)
    dateAdded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.address

class SliderHome(models.Model):
    image = models.ImageField(null=True, blank=True)
    url = models.CharField(default='home', max_length=200 ,null=True, blank=True)