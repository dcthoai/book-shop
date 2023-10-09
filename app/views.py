from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import check_password
from django.views.decorators.csrf import csrf_exempt # disable django's verifier (Cross-Site Request Forgery Exempt)
from django.db.models.signals import post_save
from django.forms.models import model_to_dict
from django.dispatch import receiver
from django.core.exceptions import ObjectDoesNotExist
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from .models import User, Product, Order, OrderItem, ShippingAddress, SliderHome, Profile
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


EXPIRATION_TIME = 3 * 60  # 3 minutes

# Create your views here.
# Handle send and receive new user account registration information
@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if User.objects.filter(username=data['username']).exists():
            return JsonResponse({'error': 'Username đã tồn tại, vui lòng sử dụng một tên khác.'})
        
        verifyCode = ''.join(random.choices('0123456789', k=6)) # Create a random code
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

        return JsonResponse({'success': 'Mã xác thực đã được gửi, vui lòng kiểm tra email. Mã này có hiệu lực trong vòng 3 phút.'}, status=200)
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại, vui lòng thử lại sau.'}, status=400)

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
            return JsonResponse({'error': 'Tên tài khoản này không tồn tại.'}, status=400)

        if user.check_password(password):
            login(request, user)
            return JsonResponse({'success': 'Đăng nhập thành công.'}, status=200)
        else:
            return JsonResponse({'error': 'Mật khẩu sai.'}, status=400)
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại, vui lòng thử lại sau.'}, status=400)

@csrf_exempt
def signOut(request):
    logout(request)
    return JsonResponse({'success': 'Đăng xuất thành công.'}, status=200)

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

def filter_category(request):
    category = request.GET.get('category')
    products = Product.objects.filter(category=category)
    product_list = []

    for product in products:
        product_dict = model_to_dict(product, exclude=["image"])
        product_dict['imageURL'] = product.imageURL
        product_list.append(product_dict)

    return JsonResponse(product_list, safe=False)

def account(request):
    if request.user.is_authenticated:
        user = request.user
        order, created = Order.objects.get_or_create(customer=user, complete=False)
    else:
        user = None
        order = {'get_cart_items':0, 'get_cart_total':0}
    context = {'user': user, 'order': order}
    return render(request, 'app/account.html', context)

# Update payment
def updatePayment(request):
    data = json.loads(request.body)
    name = data['name']
    phoneNumber = data['phoneNumber']
    address = data['address']
    customer = request.user
    order, created = Order.objects.get_or_create(customer=customer, complete=False)
    shipping, created = ShippingAddress.objects.get_or_create(customer=customer,order=order)
    shipping.name = name
    shipping.phoneNumber = phoneNumber
    shipping.address = address
    order.complete = True
    order.save()
    shipping.save()

    response_data = {'message': 'payment-complete'}
    return JsonResponse(response_data, safe=False) 


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

# API to update info account
@csrf_exempt
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
                verifyCode = ''.join(random.choices('0123456789', k=6))
                senderEmail = 'dcthoai1023@gmail.com'
                senderPassword = 'nyitsxfirfuskyat'
                receiverEmail = data['email']

                message = MIMEMultipart()
                message['From'] = senderEmail
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

@csrf_exempt
def getIdUser(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            return JsonResponse({'id': request.user.id})
        else:
            return JsonResponse({'error': 'Chưa có tài khoản nào đăng nhập.'})
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại, vui lòng thử lại sau.'})

@csrf_exempt
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

@csrf_exempt
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

@csrf_exempt
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

@csrf_exempt
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
            message['From'] = senderEmail
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
    
@csrf_exempt
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

@csrf_exempt
def recoverSuccess(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.get(id=data['userId'])
        user.set_password(data['new_password'])
        user.save()

        return JsonResponse({'success': 'Khôi phục tài khoản thành công, vui lòng đăng nhập lại.'})
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại, vui lòng thử lại sau.'}, status=400)

@csrf_exempt
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
            message['From'] = senderEmail
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

@csrf_exempt
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

@csrf_exempt
def createNewPassword(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.get(email=data['email'])
        user.set_password(data['new_password'])
        user.save()

        return JsonResponse({'success': 'Khôi phục tài khoản thành công, vui lòng đăng nhập lại.'})
    else:
        return JsonResponse({'error': 'Gửi yêu cầu thất bại, vui lòng thử lại sau.'}, status=400)

def notifications(request):
    if request.user.is_authenticated:
        user = request.user
        order, created = Order.objects.get_or_create(customer=user, complete=False)
    else:
        user = None
        order = {'get_cart_items':0, 'get_cart_total':0}
    context = {'order': order}
    return render(request, 'app/notifications.html', context)

def order(request):
    if request.user.is_authenticated:
        user = request.user
        orders = Order.objects.filter(customer=user, complete=True)
        list_item = []
        list_shipping = []
        if(orders.exists()):
            count = len(orders)
            for order in orders:
                items = order.orderitem_set.all()
                list_item.append(items)
                shippings = order.shippingaddress_set.all()
                list_shipping.append(shippings)
            
    else:
        user = None
        order = {'get_cart_items':0, 'get_cart_total':0}
    combined_data = [(order, items, shippings) for order, items, shippings in zip(orders, list_item, list_shipping)]
    context = {'count': count, 'combined_data': combined_data}
    return render(request, 'app/order.html', context)