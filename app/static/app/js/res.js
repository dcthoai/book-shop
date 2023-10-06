
var searchButton = document.getElementById('search-button');
var navSearch = document.querySelector('.header .nav .nav__search');
var navSearchInput = document.querySelector('.header .nav .search__input');

searchButton.addEventListener('click', function(){
    var clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if(clientWidth < 740){
        navSearch.classList.add('nav__search-mobile');
    }
})

window.addEventListener('mousedown', function(event){
    if (!navSearch.contains(event.target)){
        navSearch.classList.remove('nav__search-mobile');
        navSearchInput.value = '';

        if(searchButton.classList.contains('active')){
            searchButton.classList.remove('active');
        }
    }
});