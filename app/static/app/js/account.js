
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

var formsGroup = document.querySelectorAll('.personal .wrapper__body .form__group');
var formsGroupBox = document.querySelectorAll('.personal .wrapper__body .form__group-box');
var formsChange = document.querySelectorAll('.personal .wrapper__body .form-change');

formsGroup.forEach(function(item, index){
    formsGroupBox[index].onclick = function(){
        if(formsGroupBox[index].disabled == true)
            return;

        formsGroupBox[index].disabled = true;
        setTimeout(function(){
            formsGroupBox[index].disabled = false;
        }, 320);

        var isOpenFormChange = (formsGroupBox[index].style.marginBottom !== '0px');

        if(isOpenFormChange){
            isOpenFormChange = false;
            formsChange[index].style.animation = 'close 0.3s ease forwards';
            formsGroupBox[index].style.marginBottom = '0px';
            formsGroup[index].querySelector('i').style.transform = 'translateY(-50%)';
            setTimeout(function(){
                formsChange[index].style.display = 'none';
            }, 300);
        } else {
            isOpenFormChange = true;
            formsGroup[index].querySelector('i').style.transform = 'translateY(-50%) rotate(90deg)';
            formsChange[index].style.display = 'block';
            formsChange[index].style.animation = 'open 0.3s ease forwards';
            formsGroupBox[index].style.marginBottom = formsChange[index].offsetHeight + 'px';
        }
    }
});