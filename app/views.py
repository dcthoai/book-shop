from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt # disable django's verifier (Cross-Site Request Forgery Exempt)
from .models import User, Product, Order, OrderItem, ShippingAddress, SliderHome
import json
# from django.contrib import messages ggyiuihu asdasd

# Create your views here.

# for product in Product.objects.all():
#     product.save()

# Handle send and receive new user account registration information
@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        user.save()
        return JsonResponse({'message': 'User created successfully'}, status=201)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def signIn(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        account = data.get('name-account')
        password = data.get('password')
        User = get_user_model()
        try:
            if '@' in account:
                user = User.objects.get(email=account)
            else:
                user = User.objects.get(username=account)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Invalid username/email or password'}, status=400)

        if user.check_password(password):
            login(request, user)
            return JsonResponse({'message': 'User logged in successfully'}, status=200)
        else:
            return JsonResponse({'error': 'Invalid username/email or password'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def signOut(request):
    logout(request)
    # return redirect('home')
    return JsonResponse({'message': 'User logged out successfully'}, status=200)


# Load Home page
def home(request):
    if request.user.is_authenticated:
        customer = request.user
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
    else:
        items = []
        order = {'get_cart_items':0, 'get_cart_total':0}
    sliders = SliderHome.objects.all()
    products = Product.objects.all()
    context = {'products': products, 'order': order, 'sliders': sliders}
    return render(request, 'app/home.html', context)

# Load cart page
def cart(request):
    if request.user.is_authenticated:
        customer = request.user
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
    else:
        items = []
        order = {'get_cart_items':0, 'get_cart_total':0}
    context = {'items':items, 'order':order}
    return render(request, 'app/cart.html', context)

# Load info product page
def book(request, slugName):
    if request.user.is_authenticated:
        customer = request.user
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
    else:
        items = []
        order = {'get_cart_items':0, 'get_cart_total':0}
    products = Product.objects.all()
    product = get_object_or_404(Product, slugName=slugName)
    context = {'order': order, 'products': products, 'product': product}
    return render(request, 'app/book.html', context)

# Load payment page
def payment(request):
    if request.user.is_authenticated:
        customer = request.user
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
    else:
        items = []
        order = {'get_cart_items':0, 'get_cart_total':0}
    context = {'items':items, 'order':order}
    return render(request, 'app/payment.html', context)

# Handle update product to cart
def updateItem(request):
    data = json.loads(request.body)
    productId = data['productId']
    action = data['action']
    customer = request.user
    product = Product.objects.get(id = productId)
    order, created = Order.objects.get_or_create(customer=customer, complete=False)
    orderItem, created = OrderItem.objects.get_or_create(order=order, product=product)
    if action == 'add':
        orderItem.quantity += 1
    elif action == 'remove':
        orderItem.quantity -= 1
    elif action == 'delete':
        orderItem.quantity = -1
    orderItem.save()
    if orderItem.quantity <= 0:
        orderItem.delete()

    return JsonResponse('added', safe=False)

