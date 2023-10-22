from django.http import HttpResponse, JsonResponse, Http404
from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import check_password
from django.db.models.signals import post_save
from django.forms.models import model_to_dict
from django.dispatch import receiver
from django.core.exceptions import ObjectDoesNotExist
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from .models import User, Product, Order, OrderItem, SliderHome, Profile, Cart, CartItem
from random import sample
import unidecode
import smtplib
import random
import datetime
import json
import os
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files import File
from django.conf import settings
from django.core.paginator import Paginator, EmptyPage


EXPIRATION_TIME = 3 * 60  # 3 minutes

# Create your views here.
# Load Home page
def home(request):
    if request.user.is_authenticated:
        customer = request.user
        cart, created = Cart.objects.get_or_create(customer=customer)
    else:
        cart = {'getCartItemsAmount': 0}
    sliders = SliderHome.objects.all()
    context = {'cart': cart, 'sliders': sliders}
    return render(request, 'app/home.html', context)

# Load notifications page
def notifications(request):
    if request.user.is_authenticated:
        user = request.user
        cart, created = Cart.objects.get_or_create(customer=user)
    else:
        user = None
        cart = {'getCartItemsAmount': 0}
    context = {'cart': cart}
    return render(request, 'app/notifications.html', context)

# Load info product page
def book(request, slugName):
    if request.user.is_authenticated:
        customer = request.user
        cart, created = Cart.objects.get_or_create(customer=customer)
    else:
        customer = None
        cart = {'getCartItemsAmount': 0}
    
    allProducts = list(Product.objects.values('id', 'slugName', 'imageURL'))
    random.shuffle(allProducts)  # Xáo trộn danh sách
    if len(allProducts) > 30:
        products = allProducts[:30]  # Lấy 30 sản phẩm đầu tiên sau khi xáo trộn
    else:
        products = allProducts
    product = get_object_or_404(Product, slugName=slugName)
    context = {'cart': cart, 'products': products, 'product': product}
    return render(request, 'app/book.html', context)

# Load cart page
def cart(request):
    if request.user.is_authenticated:
        customer = request.user
        cart, created = Cart.objects.get_or_create(customer=customer)
        cartItems = cart.cartitem_set.all()
    else:
        customer = None
        cartItems = []
        cart = {'getCartItemsAmount': 0}
    context = {'cartItems': cartItems, 'cart': cart}
    return render(request, 'app/cart.html', context)

# Load payment page
def payment(request):
    if request.user.is_authenticated:
        customer = request.user
        cart, created = Cart.objects.get_or_create(customer=customer)
        try:
            order = get_object_or_404(Order, customer=customer, complete=False, active=True)
            items = order.orderitem_set.all()
        except Http404:
            order = {'get_cart_items':0, 'get_cart_total':0}
            items = []
    else:
        customer = None
        items = []
        cart = {'getCartItemsAmount': 0}
        order = {'get_cart_items':0, 'get_cart_total':0}
    context = {'cart': cart, 'order': order, 'items': items}
    return render(request, 'app/payment.html', context)

# Load informations of customer orders
def order(request):
    if request.user.is_authenticated:
        customer = request.user
        cart, created = Cart.objects.get_or_create(customer=customer)
        orders = Order.objects.filter(customer=customer)
        ordersWithItems = []

        for order in orders:
            orderItems = order.orderitem_set.all()
            ordersWithItems.append((order, orderItems))
    else:
        customer = None
        cart = {'getCartItemsAmount': 0}
        ordersWithItems = []
    context = {'cart': cart ,'ordersWithItems': ordersWithItems}
    return render(request, 'app/order.html', context)

# Load order infomations details
def orderDetails(request, order_id):
    if request.user.is_authenticated:
        customer = request.user
        cart, created = Cart.objects.get_or_create(customer=customer)
        try:
            order = get_object_or_404(Order, customer=customer, id=order_id)
            items = order.orderitem_set.all()
        except Http404:
            order = {'get_cart_items':0, 'get_cart_total':0}
            items = []
    else:
        customer = None
        cart = {'getCartItemsAmount': 0}
        order = {'get_cart_items':0, 'get_cart_total':0}
        items = []
    context = {'cart': cart ,'order': order, 'items': items}
    return render(request, 'app/orderdetail.html', context)

# Search product by name
def search(request, query):
    if request.user.is_authenticated:
        customer = request.user
        cart, created = Cart.objects.get_or_create(customer=customer)
    else:
        cart = {'getCartItemsAmount': 0}
    result = query
    query = '-'.join(unidecode.unidecode(query.strip()).split())
    products = Product.objects.filter(slugName__icontains=query)
    size = products.count()
    context = {'result' : result, 'size' : size, 'cart': cart ,'products' : products}
    return render(request, 'app/search.html', context)

# Search product by category
def filter_category(request):
    category = request.GET.get('category')
    products = Product.objects.filter(category=category)
    product_list = []

    for product in products:
        product_dict = model_to_dict(product, exclude=["image"])
        product_dict['imageURL'] = product.imageURL
        product_list.append(product_dict)

    return JsonResponse(product_list, safe=False)

# API get list product for homepage
allProductsAPI = list(Product.objects.values('id', 'name', 'price', 'cost', 'slugName', 'imageURL'))
paginator = Paginator(allProductsAPI, 18)

def productsApi(request):
    start = int(request.GET.get('start', 1))

    if start == 1:
        random.shuffle(allProductsAPI)

    try:
        pageObj = paginator.page(start)
        listProducts = list(pageObj.object_list)
    except EmptyPage:
        listProducts = []
 
    return JsonResponse(listProducts, safe=False)

# Handle update product to cart
def updateItem(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            data = json.loads(request.body)
            action = data['action']
            
            product = Product.objects.get(id=data['productId'])
            cart, created = Cart.objects.get_or_create(customer=request.user)
            cartItem, created = CartItem.objects.get_or_create(cart=cart, product=product)

            if action == 'add':
                cartItem.quantity += data['quantity']
            elif action == 'remove':
                cartItem.quantity -= 1
            elif action == 'delete':
                cartItem.quantity = -1
            cartItem.save()
            if cartItem.quantity <= 0:
                cartItem.delete()

            return JsonResponse({'success': 'Cập nhật thành công'})
        else:
            return JsonResponse({'error': 'Người dùng chưa đăng nhập'})
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại'})

# Create a order for current user
def createOrder(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            data = json.loads(request.body)
            listProductsOrder = data['listProductsOrder']

            Order.objects.filter(customer=request.user, active=True).update(active=False)
            order = Order.objects.create(customer=request.user, complete=False, active=True, isPaid=False)

            for item in listProductsOrder:
                try:
                    product = Product.objects.get(id=item['id'])
                    quantity = item['quantity']
                    orderItem, created = OrderItem.objects.get_or_create(order=order, product=product)
                    orderItem.quantity = quantity
                    orderItem.save()
                except:
                    return JsonResponse({'error': 'Sản phẩm này không còn tồn tại, vui lòng cập nhật giỏ hàng'})
            return JsonResponse({'success': 'Đã tạo đơn hàng'})
        else:
            return JsonResponse({'error': 'Vui lòng đăng nhập để thanh toán'})
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại'})

def confirmPaymentOrder(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            data = json.loads(request.body)

            try:
                order = get_object_or_404(Order, customer=request.user, complete=False, active=True)

                order.name = data['name']
                order.phoneNumber = data['phone-number']
                order.address = data['address']
                order.active = False
                order.isPaid = True
                order.save()
                return JsonResponse({'success': 'Thành công'})
            except Http404:
                return JsonResponse({'error': 'Không tìm thấy đơn hàng'}, status=404)
        else:
            return JsonResponse({'error': 'Vui lòng đăng nhập để thanh toán'})
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại'})

def paymentOrderAgain(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            data = json.loads(request.body)

            try:
                order = get_object_or_404(Order, customer=request.user, complete=False, id=data['order-id'])
                order.active = True
                order.save()

                return JsonResponse({'success': 'Gửi yêu cầu thanh toán lại thành công'})
            except Http404:
                return JsonResponse({'error': 'Không tìm thấy đơn hàng'}, status=404)
        else:
            return JsonResponse({'error': 'Vui lòng đăng nhập để thanh toán'})
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại'})

def confirmOrderComplete(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            data = json.loads(request.body)
            customer = request.user
            
            try:
                order = get_object_or_404(Order, customer=customer, id=data['order-id'])
                order.complete = True
                order.save()
                return JsonResponse({'success': 'Đơn hàng đã hoàn thành'})
            except Http404:
                return JsonResponse({'error': 'Không tìm thấy đơn hàng'})
        else:
            return JsonResponse({'error': 'Vui lòng đăng nhập để tiếp tục'})
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại'})

def updateCartItem(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            data = json.loads(request.body)
            listProductsId = data['listProductsId']

            cart, created = Cart.objects.get_or_create(customer=request.user)
            for productId in listProductsId:
                product = Product.objects.get(id=productId)
                cartItem, created = CartItem.objects.get_or_create(cart=cart, product=product)
                cartItem.delete()
            return JsonResponse({'success': 'Cập nhật thành công'})
        else:
            return JsonResponse({'error': 'Người dùng chưa đăng nhập'})
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại'})

# Load info account page
def account(request):
    if request.user.is_authenticated:
        user = request.user
        cart, created = Cart.objects.get_or_create(customer=user)
    else:
        user = None
        cart = {'getCartItemsAmount': 0}
    context = {'user': user, 'cart': cart}
    return render(request, 'app/account.html', context)

# Handle send and receive new user account registration information
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if User.objects.filter(username=data['username']).exists():
            return JsonResponse({'error': 'Username đã tồn tại, vui lòng sử dụng một tên khác.'})
        
        if User.objects.filter(email=data['email']).exists():
            return JsonResponse({'error': 'Email này đã được đăng ký cho một tài khoản khác, vui lòng sử dụng một email khác.'})
        
        verifyCode = ''.join(random.choices('0123456789', k=6)) # Create a random code
        senderEmail = 'dcthoai1023@gmail.com'
        senderPassword = 'nyitsxfirfuskyat'
        receiverEmail = data['email']

        message = MIMEMultipart()
        message['From'] = 'ABC Book'
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

        return JsonResponse({'success': 'Mã xác thực đã được gửi, vui lòng kiểm tra email. Mã này có hiệu lực trong vòng 3 phút.'}, status=200)
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại, vui lòng thử lại sau.'}, status=400)

def verify(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if 'verify_code' in request.session and data['verify_code'] == request.session['verify_code']:
            # Check if the code has expired
            if datetime.datetime.now().timestamp() - request.session['code_time'] > EXPIRATION_TIME:
                del request.session['user_data']
                del request.session['verify_code']
                del request.session['code_time']
                return JsonResponse({'error': 'Mã xác nhận này đã hết hạn.'}, status=400)

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

            return JsonResponse({'success': 'Tạo tài khoản thành công.'}, status=201)
        else:
            return JsonResponse({'error': 'Mã xác nhận không hợp lệ.'}, status=400)
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại, vui lòng thử lại sau.'}, status=400)

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
            return JsonResponse({'error': 'Tên tài khoản này không tồn tại.'}, status=400)

        if user.check_password(password):
            login(request, user)
            return JsonResponse({'success': 'Đăng nhập thành công.'}, status=200)
        else:
            return JsonResponse({'error': 'Mật khẩu sai.'}, status=400)
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại, vui lòng thử lại sau.'}, status=400)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

def signOut(request):
    logout(request)
    return JsonResponse({'success': 'Đăng xuất thành công.'}, status=200)

# API to update info account
def updateAccount(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            user = User.objects.get(id=data['userId'])

            if 'username' in data:
                if User.objects.filter(username=data['username']).exists():
                    return JsonResponse({'error': 'Username đã tồn tại, vui lòng sử dụng một tên khác.'})

                setattr(user, 'username', data['username'])
                user.save()
                return JsonResponse({'success': 'Username đã được cập nhật.'})

            elif 'fullname' in data:
                setattr(user.profile, 'fullname', data['fullname'])
                user.profile.save()
                return JsonResponse({'success': 'Tên của bạn đã được cập nhật.'})

            elif 'phone-number' in data:
                if len(data['phone-number']) == 10 and data['phone-number'].isdigit():
                    setattr(user.profile, 'phoneNumber', data['phone-number'])
                    user.profile.save()
                    return JsonResponse({'success': 'Số điện thoại đã được cập nhật.'})
                else:
                    return JsonResponse({'error': 'Số điện thoại chưa đúng định dạng (chỉ gồm 10 kí tự số).'})

            elif 'email' in data:
                if user.email == data['email']:
                    return JsonResponse({'error': 'Email này trùng với email hiện tại của bạn, vui lòng sử dụng một email khác'})

                if User.objects.filter(email=data['email']).exists():
                    return JsonResponse({'error': 'Email này đã được đăng ký cho một tài khoản khác, vui lòng sử dụng một email khác.'})
                
                verifyCode = ''.join(random.choices('0123456789', k=6))
                senderEmail = 'dcthoai1023@gmail.com'
                senderPassword = 'nyitsxfirfuskyat'
                receiverEmail = data['email']

                message = MIMEMultipart()
                message['From'] = 'ABC Book'
                message['To'] = receiverEmail
                message['Subject'] = 'Mã xác thực tài khoản của bạn'

                content = f'Nhập mã này để hoàn tất quá trình thay đổi email cho tài khoản của bạn: {verifyCode}. Mã này có hiệu lực trong vòng 3 phút.'
                message.attach(MIMEText(content, 'plain'))

                session = smtplib.SMTP('smtp.gmail.com', 587)  # Used gmail with port 587
                session.starttls()
                session.login(senderEmail, senderPassword)
                session.sendmail(senderEmail, receiverEmail, message.as_string())
                session.quit()

                # Save the user data and verification code in session
                request.session['user_email'] = data['email']
                request.session['verify_code'] = verifyCode
                request.session['code_time'] = datetime.datetime.now().timestamp()

                return JsonResponse({'success': 'Mã xác thực đã được gửi đi, vui lòng kiểm tra email. Mã này có hiệu lực trong vòng 3 phút.'}, status=200)
            else:
                return JsonResponse({'error': 'Dữ liệu không hợp lệ.'})
        except User.DoesNotExist:
            return JsonResponse({'error': 'Tài khoản không tồn tại.'})
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại, vui lòng thử lại sau.'})

def getIdUser(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            return JsonResponse({'id': request.user.id})
        else:
            return JsonResponse({'error': 'Chưa có tài khoản nào đăng nhập.'})
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại, vui lòng thử lại sau.'})

def verifyChangeEmail(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if 'verify_code' in request.session and data['verify_code'] == request.session['verify_code']:
            # Check if the code has expired
            if datetime.datetime.now().timestamp() - request.session['code_time'] > EXPIRATION_TIME:
                del request.session['email']
                del request.session['verify_code']
                del request.session['code_time']
                return JsonResponse({'error': 'Mã xác thực hết hiệu lực.'}, status=400)

            userEmail = request.session['user_email']
            user = User.objects.get(id=data['userId'])
            user.email = userEmail
            user.save()

            # Delete the user data and verification code from session
            del request.session['user_email']
            del request.session['verify_code']
            del request.session['code_time']

            return JsonResponse({'success': 'Email đã được cập nhật thành công.'}, status=201)
        else:
            return JsonResponse({'error': 'Mã xác thực không hợp lệ.'}, status=400)
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại, vui lòng thử lại sau.'}, status=400)

@api_view(['POST'])
def updateAvatar(request):
    if request.method == 'POST':
        if 'avatar' in request.FILES:
            file = request.FILES['avatar']
            user = request.user

            oldAvatarPath = user.profile.avatar.path if user.profile.avatar else None   # Get old path file user avatar
            
            # Delete old file user avatar when new avatar is update
            if oldAvatarPath and os.path.isfile(oldAvatarPath):
                os.remove(oldAvatarPath)

            user.profile.avatar.save(file.name, File(file), save=True)

            return Response({'success': 'Avatar đã được cập nhật.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Không tìm thấy file.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại, vui lòng thử lại sau.'}, status=400)

def changePassword(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.get(id=data['userId'])

        if check_password(data['password'], user.password):
            if(data['new-password'] == data['password']):
                return JsonResponse({'error': 'Mật khẩu này trùng với mật khẩu cũ, vui lòng sử dụng mật khẩu khác.'})
            else:
                user.set_password(data['new-password'])
                user.save()
                return JsonResponse({'success': 'Thay đổi mật khẩu thành công.'})
        else:
            return JsonResponse({'error': 'Mật khẩu cũ không đúng, vui lòng nhập lại.'})
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại, vui lòng thử lại sau.'})

def recoverPassword(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.get(id=data['userId'])

        if(data['email_recover'] == user.email):
            verifyCode = ''.join(random.choices('0123456789', k=6))
            senderEmail = 'dcthoai1023@gmail.com'
            senderPassword = 'nyitsxfirfuskyat'
            receiverEmail = data['email_recover']

            message = MIMEMultipart()
            message['From'] = 'ABC Book'
            message['To'] = receiverEmail
            message['Subject'] = 'Khôi phục tài khoản'

            content = f'Nhập mã này để khôi phục tài khoản của bạn: {verifyCode}. Mã này có hiệu lực trong vòng 3 phút.'
            message.attach(MIMEText(content, 'plain'))

            session = smtplib.SMTP('smtp.gmail.com', 587)  # Used gmail with port 587
            session.starttls()
            session.login(senderEmail, senderPassword)
            session.sendmail(senderEmail, receiverEmail, message.as_string())
            session.quit()

            # Save the user data and verification code in session
            request.session['verify_code'] = verifyCode
            request.session['code_time'] = datetime.datetime.now().timestamp()

            return JsonResponse({'success': 'Nhập mã khôi phục được gửi tới email của bạn. Mã này có hiệu lực trong vòng 3 phút.'}, status=200)
        else:
            return JsonResponse({'error': 'Email không khớp với tài khoản này.'}, status=400)
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại, vui lòng thử lại sau.'}, status=400)
    
def verifyRecoverPassword(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if 'verify_code' in request.session and data['verify_code'] == request.session['verify_code']:
            # Check if the code has expired
            if datetime.datetime.now().timestamp() - request.session['code_time'] > EXPIRATION_TIME:
                del request.session['verify_code']
                del request.session['code_time']
                return JsonResponse({'error': 'Mã khôi phục đã hết hiệu lực.'}, status=400)

            # Delete the user data and verification code from session
            del request.session['verify_code']
            del request.session['code_time']

            return JsonResponse({'success': 'Đã khôi phục tài khoản thành công.'}, status=201)
        else:
            return JsonResponse({'error': 'Mã khôi phục sai.'}, status=400)
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại, vui lòng thử lại sau.'}, status=400)

def recoverSuccess(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.get(id=data['userId'])
        user.set_password(data['new_password'])
        user.save()

        return JsonResponse({'success': 'Khôi phục tài khoản thành công, vui lòng đăng nhập lại.'})
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại, vui lòng thử lại sau.'}, status=400)

def recover(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            user = User.objects.get(email=data['email'])

            verifyCode = ''.join(random.choices('0123456789', k=6))
            senderEmail = 'dcthoai1023@gmail.com'
            senderPassword = 'nyitsxfirfuskyat'
            receiverEmail = data['email']

            message = MIMEMultipart()
            message['From'] = 'ABC Book'
            message['To'] = receiverEmail
            message['Subject'] = 'Khôi phục tài khoản'

            content = f'Nhập mã này để khôi phục tài khoản của bạn: {verifyCode}. Mã này có hiệu lực trong vòng 3 phút.'
            message.attach(MIMEText(content, 'plain'))

            session = smtplib.SMTP('smtp.gmail.com', 587)  # Used gmail with port 587
            session.starttls()
            session.login(senderEmail, senderPassword)
            session.sendmail(senderEmail, receiverEmail, message.as_string())
            session.quit()

            # Save the user data and verification code in session
            request.session['verify_code'] = verifyCode
            request.session['code_time'] = datetime.datetime.now().timestamp()

            return JsonResponse({'success': 'Mã khôi phục đã được gửi đi, vui lòng kiểm tra email của bạn.'})
        except:
            return JsonResponse({'error': 'Email không khớp với bất kì tài khoản nào.'})

def recoverAccount(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if 'verify_code' in request.session and data['verify_code'] == request.session['verify_code']:
            # Check if the code has expired
            if datetime.datetime.now().timestamp() - request.session['code_time'] > EXPIRATION_TIME:
                del request.session['verify_code']
                del request.session['code_time']
                return JsonResponse({'error': 'Mã khôi phục đã hết hiệu lực.'}, status=400)

            # Delete the user data and verification code from session
            del request.session['verify_code']
            del request.session['code_time']

            return JsonResponse({'success': 'Đã khôi phục tài khoản thành công.'}, status=201)
        else:
            return JsonResponse({'error': 'Mã khôi phục sai.'}, status=400)
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại, vui lòng thử lại sau.'}, status=400)

def createNewPassword(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.get(email=data['email'])
        user.set_password(data['new_password'])
        user.save()

        return JsonResponse({'success': 'Khôi phục tài khoản thành công, vui lòng đăng nhập lại.'})
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại, vui lòng thử lại sau.'}, status=400)

def sendFeedback(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            data = json.loads(request.body)
            senderEmail = 'nguyenquynh722003@gmail.com'
            senderPassword = 'pvxhpvtfdhufhwlf'
            receiverEmail = data['email']

            # Email 1
            message1 = MIMEMultipart()
            message1['From'] = 'ABCBook'
            message1['To'] = 'Tôi'
            message1['Subject'] = 'Phản hồi của khách hàng:'

            content1 = f'Phản hồi từ khách hàng {data["name"]}, địa chỉ {receiverEmail}\nNội dung:\n{data["message"]}'
            message1.attach(MIMEText(content1, 'plain'))

            # Email 2
            message2 = MIMEMultipart()
            message2['From'] = 'ABCBook'
            message2['To'] = receiverEmail
            message2['Subject'] = 'Phản hồi về góp ý của bạn'

            content2 = f'Phản hồi của bạn về trang web của chúng tôi đã được gửi đến đội ngũ quản trị viên. Vui lòng kiên nhẫn chờ đợi.'
            
            message2.attach(MIMEText(content2, 'plain'))
            session = smtplib.SMTP('smtp.gmail.com', 587)  # Used gmail with port 587
            session.starttls()
            session.login(senderEmail, senderPassword)
            try:
                session.sendmail(senderEmail, 'nguyenquynh722003@gmail.com', message1.as_string())
                session.sendmail(senderEmail, 'dcthoai1023@gmail.com', message1.as_string())
                session.sendmail(senderEmail, receiverEmail, message2.as_string())
                return JsonResponse({'success': 'Gửi phản hồi thành công'})
            except:
                return JsonResponse({'error': 'Hệ thống đang gặp lỗi, vui lòng thử lại sau'})
            session.quit()
        else:
            return JsonResponse({'error': 'Vui lòng đăng nhập để thực hiện chức năng này'})
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại, vui lòng thử lại sau.'}, status=400)