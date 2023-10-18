
addUpdateCartItemListener();

var selectAllProductBtn = document.getElementById('selectAllProducts');
var listCartItems = document.querySelectorAll('.content__cart .list-product .product');
var selectCartItems = document.querySelectorAll('.content__cart .list-product .product__select');
var listCartItemsPrice = document.querySelectorAll('.content__cart .list-product .product-total-price');
var totalPricePayment = document.getElementById('total-price');
var paymentLinkButton = document.getElementById('payment-link-btn');

function getTotalPricePayment(){
    var total = 0;

    listCartItemsPrice.forEach(function(item, index){
        if(selectCartItems[index].checked){
            let temp = item.textContent.trim();
            total += Number(temp.replace(/đ/g, ''));
        }
    });
    
    totalPricePayment.innerHTML = total + 'đ';
}

selectAllProductBtn.addEventListener('change', function(){
    if(this.checked){
        selectCartItems.forEach(function(item){
            item.checked = true;
        })
    }else{
        selectCartItems.forEach(function(item){
            item.checked = false;
        })
    }

    getTotalPricePayment();
})

selectCartItems.forEach(function(item){
    item.addEventListener('change', function(){
        getTotalPricePayment();

        if(!this.checked){
            selectAllProductBtn.checked = false;
        }
    })
})

paymentLinkButton.addEventListener('click', function(){
    var listProductsOrder = [];

    selectCartItems.forEach(function(item, index){
        if(item.checked){
            let productId = listCartItems[index].querySelector('.add-to-cart').dataset.product;
            let productQuantity = listCartItems[index].querySelector('.details__quantity-input').value.trim();
            listProductsOrder.push({'id': productId, 'quantity': productQuantity});
        }
    });

    if(listProductsOrder.length === 0) {
        alert('Bạn chưa chọn sản phẩm nào cả');
    } else {
        // Request create a order
        requestCreateOrder(listProductsOrder);
    }
})

function requestCreateOrder(listProductsOrder){
    fetch('/create-order/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            'listProductsOrder': listProductsOrder
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            window.location.href = '/payment';
        }else{
            alert(data.error);
        }
    })
    .catch(error => {
        console.log(error);
    })
}