
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

// Update amount product in shopcart
addCartEventListeners();