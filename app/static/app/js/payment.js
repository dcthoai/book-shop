
function confirmPayment() {
    // Lấy giá trị từ các ô input
    var name = document.querySelector('.info__name').value;
    var phoneNumber = document.querySelector('.info__phone-number').value;
    var address = document.querySelector('.info__address').value;
    var choseOption = null;

    //lấy giá trị nút cancel và accept
    var cancelBtn = document.querySelector('.payment__windown-btn--cancel');
    var acceptBtn = document.querySelector('.payment__windown-btn--accept');

    //kiểm tra xem người dùng chọn hình thức thanh toán nào 
    for(var i=0; i< option.length ;i++){
        if(option[i].checked){ // nếu được lựa chọn
            choseOption = option[i].value;
            break;
        }
    }

    // Hiển thị thông tin đã lấy
    if(name === "" || phoneNumber === "" || address === ""){
        if(choseOption === null){
            alert("Vui lòng nhập đầy đủ thông tin của người nhận và chọn phương thức thanh toán!");
        }else{
            alert("Vui lòng nhập đầy đủ thông tin của người nhận!");
        }
    } else if (choseOption === null) {
        alert("Vui lòng chọn phương thức thanh toán!!!");
    } else {

        if(choseOption === "momo-pay"){
            srcImg.src = "/static/app/images/momo-qr-pay.png";
        }
        else if(choseOption === "zalo-pay"){
            srcImg.src = "/static/app/images/zalo-qr-pay.jpg";
        }
        else if(choseOption === "banking"){
            srcImg.src = "/static/app/images/banking-qr-pay.jpg";
        }
        else if(choseOption === "direct-pay"){
            updatePayment(name,phoneNumber,address);
        }
        // xử lý trừng hợp thanh toán online bằng banking
        if(choseOption === "momo-pay" ||choseOption === "zalo-pay" || choseOption === "banking"){
            alert("Hiện tại thì phần thanh toán này chưa được cập nhật, bạn vui lòng chọn hình thức thanh toán khác nhé !");
            // confirm
            acceptBtn.onclick = function(){
                updatePayment(name,phoneNumber,address);
            }
            // nút cancel
            cancelBtn.onclick = function(){
                paymentConfirm.style.display = 'none';
            }
            closeBtn.onclick = function(){
                paymentConfirm.style.display = 'none';
            }
        }
        

                cancelBtn.onclick = function(){
                    paymentConfirm.style.display = 'none';
                }

                closeBtn.onclick = function(){
                    paymentConfirm.style.display = 'none';
                }
            }
        }       
    

var payment = document.getElementById('payment');
var paymentConfirm = document.getElementById('payment__confirm');
var paymentComplete = document.getElementById('payment-complete');

var confirmBtn = document.getElementById('confirm-payment-btn');
var closeBtn = paymentConfirm.querySelector('.payment__windown-close-btn');
var returnBtn = paymentComplete.querySelector('.payment-complete__btn');

var srcImg = paymentConfirm.querySelector('.payment__windown-img');
var option = document.getElementsByName('payment-method');
var nameInfo = document.getElementById('nameInfo');
var phoneNumberInfo = document.getElementById('phoneNumberInfo');
var addressInfo = document.getElementById('addressInfo');

// Thêm sự kiện "click" cho nút "Xác nhận thanh toán" khi trang đã tải xong
document.addEventListener("DOMContentLoaded", function () {
    var confirmButton = document.getElementById("confirm-payment-btn");
    confirmButton.addEventListener("click", confirmPayment);
});

 // gửi dữ liệu về 
function updatePayment(name,phoneNumber,address){
    var url = '/update-payment/';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            'phoneNumber' :phoneNumber,
            'address' :address,
            'name':name
        })
    })
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        console.log(data);
        complete(name,phoneNumber,address);
    })
}

// complete payment
function complete(name,phoneNumber,address){
    paymentConfirm.style.display = 'none';
    payment.style.display = 'none';

    nameInfo.textContent = name;
    phoneNumberInfo.textContent = phoneNumber;
    addressInfo.textContent = address;

    paymentComplete.style.display = 'block';
    returnBtn.onclick = function(){
        window.location.href = '/';
    }
}