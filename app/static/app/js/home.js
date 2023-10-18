var slider = document.querySelector('.slider .slider__content');
var sliderControl = slider.querySelector('.wrapper');
var sliderLinks = slider.querySelectorAll('.slider__link');
var nextSlideBtn = document.querySelector('.slider .next-slide');
var prevSlideBtn = document.querySelector('.slider .prev-slide');
var intervalId, timeoutId, firstSlide, lastSlide, sliderLinksItem, widthSliderItem, minIndex, currentIndex;

// Displays the current slide
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

// Move to the next slide
function nextSlide(){
    if(currentIndex - widthSliderItem == minIndex){
        showSlide(currentIndex - widthSliderItem, true);
        currentIndex = -widthSliderItem;
        setTimeout(function(){
            showSlide(-widthSliderItem, false);
        }, 500);
    }else{
        showSlide(currentIndex - widthSliderItem, true);
        currentIndex -= widthSliderItem;
    }
}

// Go to previous slide
function prevSlide(){
    if(currentIndex + widthSliderItem == 0){
        showSlide(0, true);
        currentIndex = minIndex + widthSliderItem;
        setTimeout(function(){
            showSlide(currentIndex, false);
        }, 500);
    }else{
        showSlide(currentIndex + widthSliderItem, true);
        currentIndex += widthSliderItem;
    }
}

// Start animation slider
function startSlider(){
    intervalId = setInterval(nextSlide, 4000);
}

// Add event Move to the next slide when click next button
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

// Add event Go to previous slide when click pre button
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

// Create an auto-scroll effect for the slide
function sliderScroll(){
    // Clone the first and last slide
    firstSlide = sliderLinks[0].cloneNode(true);
    lastSlide = sliderLinks[sliderLinks.length - 1].cloneNode(true);
    
    // Add the cloned slides to the beginning and end of the slider
    sliderControl.insertBefore(lastSlide, sliderControl.firstChild);
    sliderControl.appendChild(firstSlide);
    
    // Update the list of slides
    sliderLinks = slider.querySelectorAll('.slider__link');
    sliderLinksItem = slider.querySelectorAll('.slider__link-item');
    widthSliderItem = slider.offsetWidth;
    minIndex = -((sliderLinks.length - 1) * widthSliderItem);
    currentIndex = -widthSliderItem;

    sliderLinksItem.forEach(function(item){
        item.style.width = `${widthSliderItem}px`;
    })

    showSlide(-widthSliderItem, false);
    startSlider();
}

// Automatically scroll slides when the web page loaded
document.addEventListener('DOMContentLoaded', function(){
    sliderScroll();
});

// Automatically update slide size when screen size changes
window.addEventListener('resize', function(){
    widthSliderItem = slider.offsetWidth;
    minIndex = -((sliderLinks.length - 1) * widthSliderItem);
    currentIndex = -widthSliderItem;

    sliderLinksItem.forEach(function(item){
        item.style.width = `${widthSliderItem}px`;
    })
})

// Listen for the user's swipe events on the slider
function addSwipe(){
    var hammertime = new Hammer(document.querySelector('.slider .slider__content .wrapper'));
    var nextSlideBtn = document.querySelector('.slider .next-slide');
    var prevSlideBtn = document.querySelector('.slider .prev-slide');
    var clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if(clientWidth < 740){
        if(hammertime){
            hammertime.on('swiperight', function(e){
                prevSlideBtn.click();
            });
                
            hammertime.on('swipeleft', function(e){
                nextSlideBtn.click();
            });
        }
    }else{
        hammertime.off('swiperight');
        hammertime.off('swipeleft');
    }
}

addSwipe();

// Load product
var start = 1;
var content = document.querySelector('.content .wrapper');
var moreBook = document.getElementById('more-book-btn');

// Showing 18 products when the web page finishes loading
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
        addUpdateCartItemListener();
        start += 1;
    });
}

fetchProducts();

// Display 18 more products when clicking the see more button
moreBook.onclick = function(){
    fetchProducts();
}

// Get list products by category
var filter = document.getElementById('filter-btn');

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
    });
}

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

addUpdateCartItemListener();