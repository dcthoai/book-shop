
var paymentConfirmButton = document.getElementById('payment-confirm');
var formPaymentStatus = document.querySelector('.payment-status');

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
                paymentComplete();
            }else{
                alert('Phương thức thanh toán này hiện tại chưa được hỗ trợ, vui lòng chọn phương thức thanh toán khác');
            }
        }
    }
})

// function updatePayment(name, phoneNumber, address){
//     var url = '/update-payment/';
//     fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-CSRFToken': csrftoken
//         },
//         body: JSON.stringify({
//             'phoneNumber': phoneNumber,
//             'address': address,
//             'name': name
//         })
//     })
//     .then((response) => response.json())
//     .then((data) => {
//         if(data.success){
//             paymentComplete();
//         }else{
//             paymentFailed();
//         }
//     })
//     .catch(error => function(){
//         console.log(error);
//     })
// }

function paymentComplete(){
    formPaymentStatus.style.display = 'block';
    formPaymentStatus.querySelector('.payment-status__heading').innerHTML = 'Thành công';
    formPaymentStatus.querySelector('.payment-status__icon').src = `${staticURL}app/images/success-icon.png`;
    
    setTimeout(function(){
        formPaymentStatus.style.display = 'none';
    }, 3000);
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
})