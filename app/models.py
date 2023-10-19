from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
import unidecode
import re
import urllib.parse

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    fullname = models.CharField(default='user', max_length=50, null=True, blank=True)
    avatar = models.ImageField(upload_to='avatar', null=True, blank=True)
    phoneNumber = models.CharField(default='Chưa có', max_length=10, null=True, blank=True)
    address = models.CharField(default='Chưa có', max_length=300, null=True, blank=True)

    @property
    def avatarURL(self):
        url = '/static/app/images/avatar-icon.png'
        try:
            url = self.avatar.url
        except:
            url = '/static/app/images/avatar-icon.png'
        return url

class Product(models.Model):
    name = models.CharField(max_length=100, null=True)
    price = models.IntegerField()
    cost = models.IntegerField()
    image = models.ImageField(upload_to='product', null=True, blank=True)
    imageURL = models.URLField(null=True, blank=True)
    publisher = models.CharField(default='N/A', max_length=100, null=True, blank=True)
    author = models.CharField(default='N/A', max_length=100, null=True, blank=True)
    description = models.CharField(default='Người bán chưa cung cấp thông tin mô tả sản phẩm.', max_length=3000, null=True, blank=True)
    slugName = models.SlugField(unique=True, null=True, blank=True)
    
    CATEGORY_CHOICES = [
        ('category0', 'Nổi bật'),
        ('category1', 'Sách văn học'),
        ('category2', 'Sách kinh tế'),
        ('category3', 'Sách thiếu nhi'),
        ('category4', 'Sách giáo khoa'),
        ('category5', 'Sách ngoại ngữ'),
        ('category6', 'Tâm lý - kĩ năng sống'),
        ('category7', 'Tiểu sử - hồi ký'),
    ]

    category = models.CharField(
        max_length=30,
        choices=CATEGORY_CHOICES,
        default='category0',
    )
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        try:
            self.imageURL = urllib.parse.unquote(self.image.url)
        except:
            self.imageURL = '/static/app/images/icon-camera.png'

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

class Cart(models.Model):
    customer = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)

    def getCartItemsAmount(self):
        cartItems = self.cartitem_set.all()
        total = sum([item.quantity for item in cartItems])
        return total

class CartItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, blank=True, null=True)
    cart = models.ForeignKey(Cart, on_delete=models.SET_NULL, blank=True, null=True)
    quantity = models.IntegerField(default=0, null=True, blank=True)
    dateAdded = models.DateTimeField(auto_now_add=True)

    @property
    def get_total(self):
        return self.product.price * self.quantity

class Order(models.Model):
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    name = models.CharField(max_length=100, null=True)
    address = models.CharField(max_length=250, null=True)
    phoneNumber = models.CharField(max_length=10, null=True)
    dateOrder = models.DateTimeField(auto_now_add=True)
    complete = models.BooleanField(default=False, null=True, blank=False)
    active = models.BooleanField(default=False)
    isPaid = models.BooleanField(default=False) # Check if the order has been paid

    def getDateOrder(self):
        weekdays = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"]
        return weekdays[self.dateOrder.astimezone().weekday()] + ', ' + self.dateOrder.astimezone().strftime("%d/%m/%Y, %H:%M")

    def __str__(self):
        return str(self.id)

    @property
    def getOrderItemsAmount(self):
        orderitems = self.orderitem_set.all()
        total = sum([item.quantity for item in orderitems])
        return total
    
    def getOrderTotalPrice(self):
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

class SliderHome(models.Model):
    image = models.ImageField(upload_to='sliders', null=True, blank=True)
    url = models.CharField(default='/', max_length=200 ,null=True, blank=True)