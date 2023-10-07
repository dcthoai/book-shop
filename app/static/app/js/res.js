
var searchButton = document.getElementById('search-button');
var navSearch = document.querySelector('.header .nav .nav__search');
var navSearchInput = document.querySelector('.header .nav .search__input');

// Change the search interface when on mobile screens
searchButton.addEventListener('click', function(){
    var clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if(clientWidth < 740){
        navSearch.classList.add('nav__search-mobile');
    }
})

// Hide the search bar when click outside
window.addEventListener('mousedown', function(event){
    if (!navSearch.contains(event.target)){
        navSearch.classList.remove('nav__search-mobile');
        navSearchInput.value = '';

        if(searchButton.classList.contains('active')){
            searchButton.classList.remove('active');
        }
    }
});

// Change interface account settings when on mobile screen
window.addEventListener('DOMContentLoaded', function(){
    var clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if(clientWidth < 740){
        var navItems = document.querySelectorAll('.personal .controls .nav__item');
        var detailItems = document.querySelectorAll('.personal .details .wrapper');
        var detailsForm = document.querySelector('.personal .details');
        var detailsBackBtn = document.querySelectorAll('.personal .details .wrapper-back');
        
        navItems.forEach(function(navItem, index){
            navItem.classList.remove('active');
            detailItems[index].classList.remove('active');

            navItem.addEventListener('click', function(){
                navItems.forEach(function(item, i){
                    item.classList.remove('active');
                    detailItems[i].classList.remove('active');
                });

                navItem.classList.add('active');
                detailItems[index].classList.add('active');
                detailsForm.style.left = '0';
                
            });
        });

        detailsBackBtn.forEach(function(button, index){
            button.addEventListener('click', function(){
                navItems.forEach(function(item, i){
                    item.classList.remove('active');
                });
                
                detailsForm.style.left = '100%';

                setTimeout(function(){
                    detailItems[index].classList.remove('active');
                }, 400);
            })
        })
    }
});