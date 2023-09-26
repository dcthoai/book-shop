
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