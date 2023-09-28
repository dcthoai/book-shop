
var buttonControls = document.querySelectorAll('.personal .controls .nav__item');
var items = document.querySelectorAll('.personal .details .wrapper');
const loaddingElement = document.querySelector('.loadding');

addEventFormsGroup();

buttonControls.forEach(function(buttonControl, index) {
    buttonControl.addEventListener('click', function() {
        buttonControls.forEach(function(button, i){
            button.classList.remove('active');
            items[i].classList.remove('active');
        });

        this.classList.add('active');
        items[index].classList.add('active');
        closeAllFormChange(items[index].querySelectorAll('.form__group'), -1);
        addEventFormsGroup();
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

// Add event for forms personal-info
// Open form change personal infomations
function openFormChange(item){
    var formChange = item.querySelector('.form-change');
    var formGroupBox = item.querySelector('.form__group-box');

    item.querySelector('i').style.transform = 'translateY(-50%) rotate(90deg)';
    formChange.style.display = 'block';
    formChange.style.animation = 'open 0.3s ease forwards';
    formGroupBox.style.marginBottom = formChange.offsetHeight + 'px';
}

// Close form change personal infomations
function closeFormChange(item){
    var formChange = item.querySelector('.form-change');
    var formGroupBox = item.querySelector('.form__group-box');

    item.querySelector('i').style.transform = 'translateY(-50%)';
    formChange.style.animation = 'close 0.3s ease forwards';
    formGroupBox.style.marginBottom = '0px';
    setTimeout(function(){
        formChange.style.display = 'none';
    }, 300);
}

// Close all form change
function closeAllFormChange(formsGroup, index){
    formsGroup.forEach(function(item, i){
        if (i != index){
            closeFormChange(item);
            item.querySelector('.form-change').style.display = 'none';
        }
    })
}

function addEventFormsGroup(){
    var formsGroup = document.querySelectorAll('.personal .wrapper.active .form__group');
    var formsGroupBox = document.querySelectorAll('.personal .wrapper.active .form__group-box');

    formsGroup.forEach(function(item, index){
        formsGroupBox[index].addEventListener('click', function(){
            if(formsGroupBox[index].disabled == true)
                return;

            formsGroupBox[index].disabled = true;
            setTimeout(function(){
                formsGroupBox[index].disabled = false;
            }, 320);

            let isOpen = item.querySelector('.form__group-box').style.marginBottom !== '0px';   // default = false

            if(isOpen){
                isOpen = false;
                closeFormChange(item);
            }else{
                isOpen = true;
                closeAllFormChange(formsGroup, index);
                openFormChange(item);
            }
        })
    });
}

// Get user id when account page is loaded
var userId;

document.addEventListener('DOMContentLoaded', (event) => {
    if (window.location.pathname === '/account/') {
        fetch('/api/user-id/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            userId = data.id;
        })
        .catch(error => {
            console.error('Error:', error);
        })
    }
});

// function update data for account
var formsChange = document.querySelectorAll('.personal .details .wrapper.active .form-change');
var formMain = document.querySelector('.personal .form-main')
var formLayer = formMain.querySelector('.form__layer');
const formVerifyEmail = `
    <form action="" method="POST" class="form__verify">
        <h4 class="form__verify-heading">Nhập mã xác thực được gửi tới email của bạn</h4>
        <p class="form__verify-noti">Nếu bạn không thấy email xác nhận trong hòm thư của mình, 
            hãy thử kiểm tra mục thư spam hoặc kiểm tra lại tên email đã nhập đúng chưa và thử lại.
        </p>

        <input type="text" name="verify_code" class="form__verify-input" placeholder="Nhập mã xác nhận gồm 6 chữ số">
        <div class="form__verify-wrapper">
            <button type="button" class="form__verify-cancel">Quay lại</button>
            <button type="button" class="form__verify-submit">Xác nhận</button>
        </div>
    </form>
`;

formsChange.forEach(function(formChange){
    var inputElement = formChange.querySelector('.form__body-input');
    var buttonChange = formChange.querySelector('.form__body-submit');

    buttonChange.addEventListener('click', function(){
        var data = inputElement.value;
        let isEmail = inputElement.name == 'email';

        if (data.trim() !== ''){
            loaddingElement.style.display = 'block';

            fetch(`/api/update-account/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    [inputElement.name]: data,
                    userId: userId,
                })
            })
            .then(response => response.json())
            .then(data => {
                setTimeout(function(){
                    loaddingElement.style.display = 'none';
                }, 200);

                if(data.status === 'success'){
                    if(isEmail){
                        verifyChangeEmail();
                    } else {
                        setTimeout(function(){
                            location.reload();
                        }, 200);
                    }
                } else {
                    alert(data.error);
                }
            })
            .catch(error => {
                loaddingElement.style.display = 'none';
                console.error('Error:', error);
            })
        }
    });
})

function verifyChangeEmail(){
    formMain.style.display = 'block';
    formLayer.innerHTML = formVerifyEmail;
    var formInputEmail = formLayer.querySelector('.form__verify-input');
    var formSubmit = formLayer.querySelector('.form__verify-submit');
    var formCancel = formLayer.querySelector('.form__verify-cancel');
    var formClose = formMain.querySelector('.form__close-btn');

    formClose.addEventListener('click', function(){
        formMain.style.display = 'none';
    })

    formSubmit.addEventListener('click', function(){
        loaddingElement.style.display = 'block';
        let data = formInputEmail.value

        fetch('/api/verify-change-email/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                verify_code: data,
                userId: userId
            })
        })
        .then(response => response.json())
        .then(data => {
            setTimeout(function(){
                loaddingElement.style.display = 'none';
            }, 200);

            if(data.success){
                setTimeout(function(){
                    location.reload();
                }, 200);
            } else {
                alert('Error', data.error);
            }
        })
        .catch(error => {
            loaddingElement.style.display = 'none';
            console.error('Error:', error);
        })
    })

    formCancel.addEventListener('click', function(){
        formMain.style.display = 'none';
        formLayer.innerHTML = '';
    })
}