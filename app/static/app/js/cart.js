
// Update product to cart
function addCartEventListeners() {
    var addToCartBtns = document.querySelectorAll('.add-to-cart');

    addToCartBtns.forEach(function(btn) {
        btn.onclick = function(){
            var productId = this.dataset.product
            var action = this.dataset.action
            var quantity = parseInt(this.dataset.quantity, 10); //update

            if(user === "AnonymousUser"){
                alert('User not logged in');
            }else{
                updateUserOrder(productId, action, quantity);
            }
        }
    });
}

// POST request to update product in cart
function updateUserOrder(productId, action, quantity){
    var url = '/update-item/';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            'productId': productId,
            'action': action,
            'quantity':quantity
        })
    })
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        location.reload();
    })
}

addCartEventListeners();

//Check cart is empty
document.addEventListener("DOMContentLoaded", function () {
    var paymentBtn = document.getElementById("payment__link-btn");
    
    if(paymentBtn){
        paymentBtn.onclick = function(){
            if(cartItems === 0){
                alert("Giỏ hàng của bạn đang rỗng, quay lại đặt hàng ngay thôi!")
            }else{
                window.location.href = '/payment/';
            }
        }
    }
});
