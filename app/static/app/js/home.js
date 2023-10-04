
document.addEventListener('DOMContentLoaded', function(){
    var sliderControl = document.querySelector('.slider .slider__content .wrapper');
    var sliderLinks = document.querySelectorAll('.slider__link');
    var nextSlideBtn = document.querySelector('.slider .next-slide');
    var prevSlideBtn = document.querySelector('.slider .prev-slide');
    var intervalId, timeoutId;

    // Clone the first and last slide
    var firstSlide = sliderLinks[0].cloneNode(true);
    var lastSlide = sliderLinks[sliderLinks.length - 1].cloneNode(true);
    
    // Add the cloned slides to the beginning and end of the slider
    sliderControl.insertBefore(lastSlide, sliderControl.firstChild);
    sliderControl.appendChild(firstSlide);
    
    // Update the list of slides
    sliderLinks = document.querySelectorAll('.slider__link');
    var minIndex = -((sliderLinks.length - 1) * 760);
    var currentIndex = -760;

    function showSlide(index, isTransition){
        if(isTransition){
            sliderControl.offsetHeight;
            sliderControl.style.transition = 'all 500ms ease 0s';
        }else{
            sliderControl.offsetHeight;
            sliderControl.style.transition = 'all 0ms ease 0s';
        }
        sliderControl.style.transform = `translateX(${index}px)`;
        sliderControl.offsetHeight;
        sliderControl.style.transition = 'all 0ms ease 0s';
    }

    function nextSlide(){
        if(currentIndex - 760 == minIndex){
            showSlide(currentIndex - 760, true);
            currentIndex = -760;
            setTimeout(function(){
                showSlide(-760, false);
            }, 500);
        }else{
            showSlide(currentIndex - 760, true);
            currentIndex -= 760;
        }
    }

    function prevSlide(){
        if(currentIndex + 760 == 0){
            showSlide(0, true);
            currentIndex = minIndex + 760;
            setTimeout(function(){
                showSlide(currentIndex, false);
            }, 500);
        }else{
            showSlide(currentIndex + 760, true);
            currentIndex += 760;
        }
    }
                
    showSlide(-760, false);
    function startSlider(){
        intervalId = setInterval(nextSlide, 4000);
    }

    nextSlideBtn.addEventListener('click', function() {
        if(nextSlideBtn.disabled)
            return;
        nextSlideBtn.disabled = true;
        setTimeout(function(){
            nextSlideBtn.disabled = false;
        }, 500);
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        nextSlide();
        timeoutId = setTimeout(function(){
            startSlider();
        }, 3000);
    });

    prevSlideBtn.addEventListener('click', function() {
        if(prevSlideBtn.disabled)
            return;
        prevSlideBtn.disabled = true;
        setTimeout(function(){
            prevSlideBtn.disabled = false;
        }, 500);
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        prevSlide();
        timeoutId = setTimeout(function(){
            startSlider();
        }, 3000);
    });

    startSlider();
});

// Load product
var start = 0;
var content = document.querySelector('.content .wrapper');
var moreBook = document.getElementById('more-book-btn');

function fetchProducts() {
    fetch(`/api/products?start=${start}`)
        .then(response => response.json())
        .then(products => {
            if (products.length === 0){
                return;
            }
            let productHTML = products.map(product => `
                <div class="book">
                    <a href="/book/${product.slugName}" class="book__link">
                        <div class="book__img" style="background-image: url(${product.imageURL});"></div>
                        <div class="book__info">
                            <h4 class="info__name">${product.name}</h4>
                            <h4 class="info__price"><del>${product.cost}đ</del>  ${product.price}đ</h4>
                        </div>
                    </a>

                    <button type="button" data-product="${product.id}" data-action="add" class="add-to-cart">Thêm vào giỏ hàng</button>
                </div>
            `).join('');

            content.innerHTML += productHTML;

            addCartEventListeners();
            start += 18;
        });
}

fetchProducts();

moreBook.onclick = function(){
    fetchProducts();
}

// Get list products by category
function fetchProductsByCategory(category) {
    fetch(`/filter-category?category=${category}`)
        .then(response => response.json())
        .then(products => {
            if (products.length === 0){
                content.innerHTML = '';
                return;
            }
            let productHTML = products.map(product => `
                <div class="book">
                    <a href="/book/${product.slugName}" class="book__link">
                        <div class="book__img" style="background-image: url(${product.imageURL});"></div>
                        <div class="book__info">
                            <h4 class="info__name">${product.name}</h4>
                            <h4 class="info__price"><del>${product.cost}đ</del>  ${product.price}đ</h4>
                        </div>
                    </a>
                    <button type="button" data-product="${product.id}" data-action="add" class="add-to-cart">Thêm vào giỏ hàng</button>
                </div>
            `).join('');

            content.innerHTML = '';
            content.innerHTML += productHTML;
            addCartEventListeners();
        });
}

var filter = document.getElementById('filter-btn');

filter.onclick = function() {
    var select = document.querySelector('.filter-category option:checked');

    if(select.value == 'category0') {
        window.location.href = '/';
    }else{
        category = select.value;
        document.getElementById('more-book-btn').style.display = 'none';
        document.querySelector('.content__heading').textContent = select.textContent;
        fetchProductsByCategory(category);
    }
}