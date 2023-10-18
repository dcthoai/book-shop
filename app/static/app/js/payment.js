
var paymentConfirmButton = document.getElementById('payment-confirm');
var formPaymentStatus = document.querySelector('.payment-status');
var listProductsOrderComplete = document.querySelectorAll('.payment .list__product .product');

paymentConfirmButton.addEventListener('click', function(){
    var name = document.querySelector('.payment .payment__info input[name="payment-name"]').value.trim();
    var phoneNumber = document.querySelector('.payment .payment__info input[name="payment-phone"]').value.trim();
    var address = document.querySelector('.payment .payment__info input[name="payment-address"]').value.trim();
    var paymentMethodOptions = document.querySelectorAll('.payment .payment__method input[name="payment-method"]');
    var choseOption = null;

    paymentMethodOptions.forEach(function(item){
        if(item.checked){
            choseOption = item.value;
        }
    });

    if(name == '' || phoneNumber == '' || address == ''){
        alert("Vui lòng nhập đầy đủ thông tin của người nhận!");
    }else{
        if(choseOption === null){
            alert("Vui lòng chọn phương thức thanh toán!");
        }else{
            if(choseOption == 'cash-pay'){
                confirmPaymentOrder(name, phoneNumber, address);
            }else{
                alert('Phương thức thanh toán này hiện tại chưa được hỗ trợ, vui lòng chọn phương thức thanh toán khác');
            }
        }
    }
})

function confirmPaymentOrder(name, phoneNumber, address){
    fetch('/confirm-payment-order/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            'name': name,
            'phone-number': phoneNumber,
            'address': address
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            paymentComplete();
        }else{
            paymentFailed();
        }
    })
    .catch(error => {
        console.log(error);
    })
}

function updateCartItemsIsOrder(){
    var listProductsId = [];

    listProductsOrderComplete.forEach(function(item){
        let id = item.dataset.product;
        listProductsId.push(id);
    });

    fetch('/update-cart-items/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            'listProductsId': listProductsId
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            console.log('success');
        }else{
            console.log(data.error);
        }
    })
    .catch(error => {
        console.log(error);
    })
}

function paymentComplete(){
    formPaymentStatus.style.display = 'block';
    formPaymentStatus.querySelector('.payment-status__heading').innerHTML = 'Thành công';
    formPaymentStatus.querySelector('.payment-status__icon').src = `${staticURL}app/images/success-icon.png`;
    
    setTimeout(function(){
        formPaymentStatus.style.display = 'none';
        window.location.href = '/order';
    }, 3000);

    updateCartItemsIsOrder();
}

function paymentFailed(){
    formPaymentStatus.style.display = 'block';
    formPaymentStatus.querySelector('.payment-status__heading').innerHTML = 'Thất bại';
    formPaymentStatus.querySelector('.payment-status__icon').src = `${staticURL}app/images/failed-icon.png`;

    setTimeout(function(){
        formPaymentStatus.style.display = 'none';
    }, 3000);
}

formPaymentStatus.querySelector('.payment-status__ok').addEventListener('click', function(){
    formPaymentStatus.style.display = 'none';
    if(formPaymentStatus.querySelector('.payment-status__heading').innerHTML == 'Thành công'){
        window.location.href = '/order';
    }
})