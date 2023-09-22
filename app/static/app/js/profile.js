


var buttonControls = document.querySelectorAll('.personal .controls .nav__item');
var items = document.querySelectorAll('.personal .details .wrapper');

buttonControls.forEach(function(buttonControl, index) {
    buttonControl.addEventListener('click', function() {
        buttonControls.forEach(function(button, i){
            button.classList.remove('active');
            items[i].classList.remove('active');
        });

        this.classList.add('active');
        items[index].classList.add('active');
    });
});

// Handle change avatar img
var container = document.querySelector('.personal .container');
var formAvatar = document.querySelector('.personal .form-avatar');
var formAvatarClose = formAvatar.querySelector('.form__close');
var formAvatarSubmit = formAvatar.querySelector('.form__submit-btn');
var formAvatarDemo = formAvatar.querySelector('.form__content-demo img');
var chooseFileAvatar = document.getElementById('file-avatar');
var changeAvatarBtn = document.getElementById('change-avatar');
var personalAvatar = document.getElementById('avatar');

chooseFileAvatar.addEventListener('change', function(e) {
    formAvatarDemo.src = URL.createObjectURL(e.target.files[0]);
});

changeAvatarBtn.onclick = function(){
    container.style.display = 'block';
    formAvatarDemo.src = personalAvatar.src;
};

formAvatarClose.onclick = function(){
    if(container.style.display == 'block'){
        container.style.display = 'none';
    }
};
    
formAvatarSubmit.onclick = function(){
    if(container.style.display == 'block'){
        container.style.display = 'none';
        // Call API

        personalAvatar.src = formAvatarDemo.src;
    }
};