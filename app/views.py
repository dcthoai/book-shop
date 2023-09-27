from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt # disable django's verifier (Cross-Site Request Forgery Exempt)
from django.db.models.signals import post_save
from django.forms.models import model_to_dict
from django.dispatch import receiver
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from .models import User, Product, Order, OrderItem, ShippingAddress, SliderHome, Profile
from random import sample
import unidecode
import smtplib
import random
import datetime
import json


EXPIRATION_TIME = 3 * 60  # 3 minutes

# Create your views here.
# Handle send and receive new user account registration information
@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        # Create a random code
        verifyCode = ''.join(random.choices('0123456789', k=6))

        senderEmail = 'dcthoai1023@gmail.com'
        senderPassword = 'nyitsxfirfuskyat'
        receiverEmail = data['email']

        message = MIMEMultipart()
        message['From'] = senderEmail
        message['To'] = receiverEmail
        message['Subject'] = 'Mã xác thực tài khoản của bạn'

        content = f'Nhập mã này để hoàn tất đăng ký tài khoản của bạn: {verifyCode}. Mã này có hiệu lực trong vòng 3 phút.'
        message.attach(MIMEText(content, 'plain'))

        session = smtplib.SMTP('smtp.gmail.com', 587)  # Used gmail with port 587
        session.starttls()
        session.login(senderEmail, senderPassword)

        session.sendmail(senderEmail, receiverEmail, message.as_string())
        session.quit()

        # Save the user data and verification code in session
        request.session['user_data'] = data
        request.session['verify_code'] = verifyCode
        request.session['code_time'] = datetime.datetime.now().timestamp()

        return JsonResponse({'success': 'Verification code sent, please check your email. The code will expire in 3 minutes.'}, status=200)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def verify(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if 'verify_code' in request.session and data['verify_code'] == request.session['verify_code']:
            # Check if the code has expired
            if datetime.datetime.now().timestamp() - request.session['code_time'] > EXPIRATION_TIME:
                del request.session['user_data']
                del request.session['verify_code']
                del request.session['code_time']
                return JsonResponse({'error': 'Verification code expired'}, status=400)

            user_data = request.session['user_data']
            user = User.objects.create_user(
                username=user_data['username'],
                email=user_data['email'],
                password=user_data['password']
            )
            user.save()

            # Delete the user data and verification code from session
            del request.session['user_data']
            del request.session['verify_code']
            del request.session['code_time']

            return JsonResponse({'success': 'User created successfully'}, status=201)
        else:
            return JsonResponse({'error': 'Invalid verification code'}, status=400)
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
            return JsonResponse({'success': 'User logged in successfully'}, status=200)
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
def get_recommendations(product, products, num_recommendations=4):
   
    # Xác định logic chọn sản phẩm gợi ý ở đây, ví dụ: các sản phẩm cùng thể loại.
    related_products = [p for p in products if p.category == product.category]
    
    # Lựa chọn ngẫu nhiên một số sản phẩm gợi ý từ danh sách sản phẩm liên quan.
    recommended_products = sample(related_products, min(num_recommendations, len(related_products)))
    
    return recommended_products
def my_view(request):
    # Lấy danh sách sản phẩm gợi ý từ bất kỳ nguồn dữ liệu nào, ví dụ: từ hàm get_recommendations
    recommended_products = get_recommendations()  # Thay thế bằng cách lấy sản phẩm gợi ý thực tế
    
    # Đặt danh sách sản phẩm gợi ý vào context
    context = {
        'recommended_products': recommended_products,
    }
    
    
    return render(request, 'home.html', context)
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

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

def search(request, query):
    if request.user.is_authenticated:
        customer = request.user
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
    else:
        items = []
        order = {'get_cart_items':0, 'get_cart_total':0}

    result = query
    query = '-'.join(unidecode.unidecode(query.strip()).split())
    products = Product.objects.filter(slugName__icontains=query)
    size = products.count()
    context = {'result' : result, 'size' : size, 'order' : order ,'products' : products}
    return render(request, 'app/search.html', context)

def account(request):
    if request.user.is_authenticated:
        user = request.user
    else:
        user = None
    context = {'user': user}
    return render(request, 'app/account.html', context)

# API get list product for homepage
def productsApi(request):
    start = int(request.GET.get('start', 0))
    products = Product.objects.all()[start:start+18]

    product_list = []
    for product in products:
        product_dict = model_to_dict(product, exclude=["image"])  # remove image field
        product_dict['imageURL'] = product.imageURL  # add URL image
        product_list.append(product_dict)

    return JsonResponse(product_list, safe=False)
