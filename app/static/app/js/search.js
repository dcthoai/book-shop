// Handle search function
$(document).ready(function(){
    function Search(query) {
        if(query != '')
            window.location.href = '/search/' + query;
    }

    var buttonSearch = $('#search-button');
    var inputSearch = $('#search-input');

    inputSearch.keyup(function(){
        var inputValue = $(this).val();
        if ($.trim(inputValue)) {
            buttonSearch.addClass('active');
        } else {
            buttonSearch.removeClass('active');
        }
    });

    inputSearch.keypress(function(event){
        // Catch event Enter onclick
        if(event.which == 13) {
            var data = inputSearch.val();
            Search(data);
        }
    });

    buttonSearch.mousedown(function(){
        buttonSearch.addClass('click');
    });
    
    buttonSearch.mouseup(function(){
        buttonSearch.removeClass('click');
        var data = inputSearch.val();
            Search(data);
    });
    
    buttonSearch.mouseleave(function(){
        buttonSearch.removeClass('click');
    });
});

// Update amount product in shopcart
addUpdateCartItemListener();