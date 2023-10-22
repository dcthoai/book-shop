
// Hide and show product description content
var content = document.getElementById('product-content-des');
var showDesBook = document.getElementById('toggleDesBook');
var fullText = content.innerHTML;
var shortText = '';
var isTextTooLong = false;

// Shorten product description content when it is too long
if(fullText.length > 200){
    isTextTooLong = true;
    shortText = fullText.substring(0, 200) + "...";
    content.innerHTML = shortText;
    showDesBook.innerHTML = 'Xem thêm';
    showDesBook.style.display = 'inline';
}

// Add event showmore or hide product description content when it is too long
if(isTextTooLong){
    showDesBook.addEventListener('click', function(){
        if(showDesBook.innerHTML === 'Xem thêm'){
            content.innerHTML = fullText;
            showDesBook.innerHTML = 'Thu gọn';
        }else{
            content.innerHTML = shortText;
            showDesBook.innerHTML = 'Xem thêm';
        }
    });
}else{
    showDesBook.innerHTML = '';
    showDesBook.style.display = 'none';
    content.innerHTML = fullText;
}

// Animation slider for suggest products
var bookSuggest = document.querySelector('.suggest .suggest__content');
var suggestWrapper = document.querySelector('.suggest .suggest__content .wrapper');
const prevSuggest = document.getElementById('prev-suggest');
const nextSuggest = document.getElementById('next-suggest');
var index = 1;

prevSuggest.addEventListener('mousedown', function(){
    prevSuggest.style.transform = 'scale(0.85)';
    prevSuggest.style.color = '#ff0000';
})

prevSuggest.addEventListener('mouseup', function(){
    prevSuggest.style.transform = 'scale(1)';
    prevSuggest.style.color = '#000';
    if(index == 0){
        return;
    }else{
        if(index == 5)
            index = 4;
        index--;
        suggestWrapper.style.transform = `translateX(-${index * 1080}px)`;
    }
})

prevSuggest.addEventListener('mouseleave', function(){
    prevSuggest.style.transform = 'scale(1)';
    prevSuggest.style.color = '#000';
})

nextSuggest.addEventListener('mousedown', function(){
    nextSuggest.style.transform = 'scale(0.9)';
    nextSuggest.style.color = '#ff0000';
})

nextSuggest.addEventListener('mouseup', function(){
    nextSuggest.style.transform = 'scale(1)';
    nextSuggest.style.color = '#000';
    if(index == 5){
        return;
    }else{
        if(index == 0)
            index = 1;
        suggestWrapper.style.transform = `translateX(-${index * 1080}px)`;
        index++;
    }
})

nextSuggest.addEventListener('mouseleave', function(){
    nextSuggest.style.transform = 'scale(1)';
    nextSuggest.style.color = '#000';
})

var buyNowButton = document.querySelector('.content__product .buy .buy-now-btn');
var addToCartButton = document.querySelector('.content__product .buy .shop-cart-btn.add-to-cart');
var productQuantityInput = document.querySelector('.content__product .quantity__book #quantity');
var quantityNextButton = document.querySelector('.content__product .quantity__book .quantity__add');
var quantityPrevButton = document.querySelector('.content__product .quantity__book .quantity__sub');

quantityNextButton.addEventListener('click', function(){
    productQuantityInput.value = Number(productQuantityInput.value) + 1;
});

quantityPrevButton.addEventListener('click', function(){
    if(Number(productQuantityInput.value) > 1){
        productQuantityInput.value = Number(productQuantityInput.value) - 1;
    }
})

buyNowButton.addEventListener('click', function(){
    let productId = buyNowButton.dataset.product;
    let quantityProduct = Number(productQuantityInput.value);
    let listProductsOrder = [{'id': productId, 'quantity': quantityProduct}];

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
});

addToCartButton.addEventListener('click', function(){
    let productId = addToCartButton.dataset.product;
    let action = addToCartButton.dataset.action;
    let quantityProduct = Number(productQuantityInput.value);

    if(user === "AnonymousUser"){
        alert('Vui lòng đăng nhập để thực hiện chức năng này');
    }else{
        updateCartItem(productId, action, quantityProduct);
    }
})