from django.contrib import admin

# Register your models here.
from .models import Product, Order, OrderItem, ShippingAddress, SliderHome

admin.site.register(Product)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
admin.site.register(SliderHome)
 