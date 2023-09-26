
var content = document.querySelector('.content__product .product-info .info__decription .info__decription-content');
var btn = document.getElementById('toggleDesBook');

var fullText = content.innerHTML;
var shortText = '';
var isTextTooLong = false;

if(fullText.length > 350){
    isTextTooLong = true;
    shortText = fullText.substring(0, 350) + "...";
    content.innerHTML = shortText;
    btn.innerHTML = 'Xem thêm';
    btn.style.display = 'inline';
}

if(isTextTooLong){
    btn.addEventListener('click', function(){
        if(btn.innerHTML === 'Xem thêm'){
            content.innerHTML = fullText;
            btn.innerHTML = 'Thu gọn';
        }else{
            content.innerHTML = shortText;
            btn.innerHTML = 'Xem thêm';
        }
    });
}else{
    btn.innerHTML = '';
    btn.style.display = 'none';
    content.innerHTML = fullText;
}

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

