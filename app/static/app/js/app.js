
const formSignUpHtml = `
    <form action="" method="POST" id="form-1">
        <div class="form-group form-username">
            <label for="username" class="form-label">Tên đăng nhập</label>
            <input id="username" name="username" type="text" placeholder="VD: My name" class="form-control">
            <span class="form-message"></span>
        </div>

        <div class="form-group form-email">
            <label for="email" class="form-label">Email</label>
            <input id="email" name="email" type="text" placeholder="VD: email@domain.com" class="form-control">
            <span class="form-message"></span>
        </div>

        <div class="form-group form-password">
            <label for="password" class="form-label">Mật khẩu</label>
            <input id="password" name="password" type="password" placeholder="Nhập mật khẩu" class="form-control">
            <span class="form-message"></span>
        </div>

        <div class="form-group form-password-confirmation">
            <label for="password_confirmation" class="form-label">Nhập lại mật khẩu</label>
            <input id="password_confirmation" name="password_confirmation" placeholder="Nhập lại mật khẩu" type="password" class="form-control">
            <span class="form-message"></span>
        </div>

        <button class="form-submit">Đăng ký</button>
    </form>
`;

const formSignInHtml = `
    <form action="" method="POST" id="form-1">
        <div class="form-group form-name-account">
            <label for="name-account" class="form-label">Tài khoản</label>
            <input id="name-account" name="name-account" type="text" placeholder="Nhập username hoặc email của bạn" class="form-control">
            <span class="form-message"></span>
        </div>

        <div class="form-group form-password">
            <label for="password" class="form-label">Mật khẩu</label>
            <input id="password" name="password" type="password" placeholder="Nhập mật khẩu" class="form-control">
            <span class="form-message"></span>
        </div>

        <button class="form-submit">Đăng nhập</button>
        <div class="forgot-password">Quên mật khẩu ?</div>
    </form>
`;

const formVerifyHtml = `
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

const formRecover = `
    <form action="" method="POST" class="form__verify">
        <h4 class="form__verify-heading">Lấy lại mật khẩu</h4>
        <p class="form__verify-noti">Nhập email đã dùng để đăng ký tài khoản của bạn.</p>

        <span class="error-message"></span>
        <input type="text" name="verify_code" class="form__verify-input" placeholder="Nhập email đăng ký tài khoản">
        <div class="form__verify-wrapper">
            <button type="button" class="form__verify-cancel">Quay lại</button>
            <button type="button" class="form__verify-submit">Xác nhận</button>
        </div>
    </form>
`;

const formForgotPasswordHTML = `
    <form action="" method="POST" class="form__verify">
        <h4 class="form__verify-heading">Nhập mã khôi phục được gửi tới email của bạn</h4>
        <p class="form__verify-noti">Nếu bạn không thấy email khôi phục trong hòm thư của mình, 
            hãy thử kiểm tra mục thư spam hoặc kiểm tra lại tên email đã nhập đúng chưa và thử lại.
        </p>

        <input type="text" name="verify_code" class="form__verify-input" placeholder="Nhập mã khôi phục gồm 6 chữ số">
        <div class="form__verify-wrapper">
            <button type="button" class="form__verify-cancel">Quay lại</button>
            <button type="button" class="form__verify-submit">Xác nhận</button>
        </div>
    </form>
`;

const formRecoverPasswordHTML = `
    <form action="" method="POST" class="form__verify">
        <h4 class="form__verify-heading">Tạo mật khẩu mới cho tài khoản của bạn.</h4>
        <span class="error-message"></span>
        <input type="password" class="form__verify-input" placeholder="Mật khẩu tối thiểu 8 kí tự">
        <button type="button" class="form__verify-submit">Xác nhận</button>
    </form>
`;

var isLoggedIn = false;
var isSignIn;
var signBtn = document.getElementById('sign-btn');
var formMain = document.getElementById('form-main');
var formLayer = formMain.querySelector('.form__layer');
var formCloseBtn = formMain.querySelector('.form__close-btn');
var formNav = formMain.querySelector('.form__nav');
var formTrans = formMain.querySelectorAll('.form__nav-btn');
var userBtn = document.getElementById('user-btn');
var formUser = document.getElementById('user-form');
var loaddingElement = document.querySelector('.loadding');

// Open form sign in/up when user do not logged in
signBtn.onclick = function(){
    if(isLoggedIn == false){
        isSignIn = true;
        formMain.style.display = 'block';
        formNav.style.display = 'block';
        formLayer.innerHTML = formSignInHtml;
        formLayer.querySelector('.forgot-password').addEventListener('click', function(){
            forgotPassword();
        })
        formTrans[0].classList.add('active');
        formTrans[1].classList.remove('active');
        validateSignIn();
    }
}

// Close form sign in/up
formCloseBtn.onclick = function(){
    formMain.style.display = 'none';
}

// Function switch to form Sign In
function viewSignIn(){
    formNav.style.display = 'block';
    formLayer.innerHTML = formSignInHtml;
    formLayer.querySelector('.forgot-password').addEventListener('click', function(){
        forgotPassword();
    })
    formTrans[0].classList.add('active');
    formTrans[1].classList.remove('active');
    validateSignIn();
    isSignIn = true;
}

// Function switch to form Sign Up
function viewSignUp(){
    formNav.style.display = 'block';
    formLayer.innerHTML = formSignUpHtml;
    formTrans[1].classList.add('active');
    formTrans[0].classList.remove('active');
    validateSignUp();
    isSignIn = false;
}

function loginSuccess(message){
    formMain.style.display = 'none';
    signBtn.style.display = 'none';
    userBtn.style.display = 'block';
    localStorage.setItem('isLoggedIn', 'true');
    setTimeout(function(){
        location.reload();
        alert(message);
    }, 500);
}

function loginFailed(message){
    alert(message);
}

function signUpSuccess(message){
    alert(message);
    viewSignIn();
    validateSignIn();
}

function signUpFailed(message){
    alert(message);
}

// Switch to form Sign In
formTrans[0].addEventListener('click', function(){
    viewSignIn();
});

// Switch to form Sign Up
formTrans[1].addEventListener('click', function(){
    viewSignUp();
});

// Check the standard data format for the form Sign Up
var validateSignUp = function(){
    Validator({
        form: '#form-1',
        formInput: '.form-group',
        errorSelector: '.form-message',
        rules: [
            Validator.isRequired('#username', 'Nhập tên đầy đủ của bạn'),
            Validator.isRequired('#email'),
            Validator.isEmail('#email', 'Nhập email của bạn'),
            Validator.isRequired('#password'),
            Validator.minLength('#password', 'Vui lòng nhập mật khẩu đủ 8 kí tự trở lên'),
            Validator.isRequired('#form-1 #password_confirmation'),
            Validator.isConfirmed('#form-1 #password_confirmation', function(){
                return document.querySelector('#form-1 #password').value;
            }, 'Mật khẩu nhập lại chưa chính xác.')
        ],
        onSubmit: function(data){
            loaddingElement.style.display = 'block';
            formCloseBtn.click();

            fetch('/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                loaddingElement.style.display = 'none';
                if(data.success){
                    alert(data.success);
                    verify();   // POST request to send an email verify
                } else {
                    signBtn.click();
                    formTrans[1].click();
                    alert(data.error);
                }
            })
            .catch((error) => {
                loaddingElement.style.display = 'none';
                alert(error);
            });
        }
    });
}

// Verify account registration code
function verify(){
    signBtn.click();
    formLayer.innerHTML = formVerifyHtml;
    formNav.style.display = 'none';

    var submitVerify = formMain.querySelector('.form__verify .form__verify-submit');
    var cancelVerify = formMain.querySelector('.form__verify .form__verify-cancel');

    // POST request verify_code
    submitVerify.addEventListener('click', function(){
        var dataVerify = {};
        var inputElement = document.querySelector('#form-main input[name="verify_code"]');
        dataVerify[inputElement.name] = inputElement.value;
        loaddingElement.style.display = 'block';

        fetch('/verify/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify(dataVerify),
        })
        .then(reponse => reponse.json())
        .then(data => {
            loaddingElement.style.display = 'none';
            if(data.success){
                signUpSuccess(data.success);
            } else {
                signUpFailed(data.error);
            }
        })
        .catch((error) => {
            loaddingElement.style.display = 'none';
            alert(error);
        })
    });

    cancelVerify.addEventListener('click', function(){
        viewSignUp();
        validateSignUp();
    });
}

// Check the standard data format for the form Sign In
var validateSignIn = function(){
    Validator({
        form: '#form-1',
        formInput: '.form-group',
        errorSelector: '.form-message',
        rules: [
            Validator.isRequired('#name-account'),
            Validator.isRequired('#password'),
            Validator.minLength('#password', 'Vui lòng nhập mật khẩu đủ 8 kí tự trở lên'),
        ],
        onSubmit: function(data){
            loaddingElement.style.display = 'block';
            formCloseBtn.click();
            // Call API
            fetch('/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                loaddingElement.style.display = 'none';
                if (data.success) {
                    loginSuccess(data.success);
                    validateSignIn();
                }else{
                    loginFailed(data.error);
                }
            })
            .catch((error) => {
                loaddingElement.style.display = 'none';
                alert(error);
            });
        }
    });
}

// Function to recover password when user not logged in
function forgotPassword(){
    formNav.style.display = 'none';
    formLayer.innerHTML = formRecover;

    var formSubmit = formLayer.querySelector('.form__verify-submit');
    var formCancel = formLayer.querySelector('.form__verify-cancel');
    var email = formLayer.querySelector('.form__verify-input');

    email.onblur = function(){
        checkEmail(this, this.value.trim(), 'Vui lòng nhập email đã đăng ký tài khoản này.');
    }

    email.oninput = function(){
        checkEmail(this, this.value.trim(), 'Vui lòng nhập email đã đăng ký tài khoản này.');
    }

    // POST request to send an email verify
    formSubmit.addEventListener('click', function(){
        loaddingElement.style.display = 'block';

        if(checkEmail(email, email.value.trim(), 'Vui lòng nhập email đã đăng ký tài khoản này.')){
            fetch('/api/recover/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({
                    email: email.value.trim()
                })
            })
            .then(response => response.json())
            .then(data => {
                loaddingElement.style.display = 'none';
    
                if(data.success){
                    recoverPassword(email.value.trim());    // Authenticated email recover
                }else{
                    alert(data.error);
                }
            })
            .catch(error => {
                loaddingElement.style.display = 'none';
                alert(error);
            })
        }
    })

    formCancel.addEventListener('click', function(){
        viewSignIn();
    })
}

// Validator email recover password
function checkEmail(inputElement, email, message = 'Trường này là bắt buộc.'){
    let re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    
    if(re.test(email)){
        inputElement.classList.remove('invalid');
        inputElement.previousElementSibling.style.display = 'none';
        formLayer.querySelector('span').innerHTML = '';
        return true;
    }else{
        formLayer.querySelector('span').innerHTML = 'Trường này là bắt buộc.';
        if(email !== ''){
            formLayer.querySelector('span').innerHTML = message;
        }
        inputElement.classList.add('invalid');
        inputElement.previousElementSibling.style.display = 'block';
        return false;
    }
}

// Send verify code to recover password
function recoverPassword(email){
    formNav.style.display = 'none';
    formLayer.innerHTML = formForgotPasswordHTML;

    var formSubmit = formLayer.querySelector('.form__verify-submit');
    var formCancel = formLayer.querySelector('.form__verify-cancel');
    var verifyCode = formLayer.querySelector('.form__verify-input');

    formSubmit.addEventListener('click', function(){
        loaddingElement.style.display = 'block';

        fetch('/api/recover-account/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                verify_code: verifyCode.value.trim()
            })
        })
        .then(response => response.json())
        .then(data => {
            loaddingElement.style.display = 'none';

            if(data.success){
                createNewPassword(email);   // Create new password when verify code success
            }else{
                alert(data.error);
            }
        })
        .catch(error => {
            loaddingElement.style.display = 'none';
            alert(error);
        })
    })

    formCancel.addEventListener('click', function(){
        viewSignIn();
    })
}

// Function create new password when recover success
function createNewPassword(email){
    formLayer.innerHTML = formRecoverPasswordHTML;
    var formSubmit = formLayer.querySelector('.form__verify-submit');
    var formCreateNewPassword = formLayer.querySelector('.form__verify-input');
    var formClose = formMain.querySelector('.form__close-btn');

    formClose.addEventListener('click', function(){
        formLayer.innerHTML = '';
        formMain.style.display = 'none';
    })

    formCreateNewPassword.onblur = function(){
        validateNewPassword(this, 'Vui lòng nhập tối thiểu 8 kí tự.');
    }

    formCreateNewPassword.oninput = function(){
        validateNewPassword(this, 'Vui lòng nhập tối thiểu 8 kí tự.');
    }

    // Validate new password and POST request to create new password
    formSubmit.addEventListener('click', function(){
        if(!validateNewPassword(formCreateNewPassword, 'Vui lòng nhập tối thiểu 8 kí tự.')){
            loaddingElement.style.display = 'block';

            fetch('/api/password/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({
                    new_password: formCreateNewPassword.value.trim(),
                    email: email
                })
            })
            .then(response => response.json())
            .then(data => {
                loaddingElement.style.display = 'none';
        
                if(data.success){
                    alert(data.success)
                    loggedOut();        // Log out account when recover success 
                }else{
                    alert(data.error);
                }
            })
            .catch(error => {
                loaddingElement.style.display = 'none';
                alert(error);
            })
        }
    });
}

// Validator new password
function validateNewPassword(item, message = 'Trường này là bắt buộc'){
    let value = item.value.trim();
    if(value.length >= 8){
        item.classList.remove('invalid');
        item.previousElementSibling.innerHTML = message;
        item.previousElementSibling.style.display = 'none';
        return false;
    }else{
        item.previousElementSibling.innerHTML = 'Trường này là bắt buộc.';
        if(value !== ''){
            item.previousElementSibling.innerHTML = message;
        }
        item.classList.add('invalid');
        item.previousElementSibling.style.display = 'block';
        return true;
    }
}

// Open/close form user when user logged in
function getFormUser(){
    if(formUser.style.display == 'block'){
        formUser.style.display = 'none';
    }else{
        formUser.style.display = 'block';    
        var logoutBtn = formUser.querySelector('.user__logout-btn');

        logoutBtn.onclick = function(){
            loggedOut();
        }
    }
}

// Add event click to open/close form user when document is loaded
window.addEventListener('load', function(){
    var isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        formMain.style.display = 'none';
        signBtn.style.display = 'none';
        userBtn.style.display = 'block';
        userBtn.onclick = function(){
            getFormUser();
        }
    }else{
        signBtn.style.display = 'block';
        isLoggedIn = false
        localStorage.setItem('isLoggedIn', 'false');
    }
});

// Add event close form user when click outside
window.addEventListener('mousedown', function(event){
    if (!formUser.contains(event.target) && !userBtn.contains(event.target)){
        formUser.style.display = 'none';
    }    
});

// Add event close form user when user changes page
window.addEventListener('beforeunload', function(){
    formUser.style.display = 'none';
});

// Logout account and move to home page
function loggedOut(){
    loaddingElement.style.display = 'block';

    fetch('/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
    })
    .then(response => response.json())
    .then(data => {
        loaddingElement.style.display = 'none';
        isLoggedIn = false;
        localStorage.setItem('isLoggedIn', 'false');
        window.location.href = '/';
    })
    .catch((error) => {
        loaddingElement.style.display = 'none';
        alert(error);
    });
}

// POST request to update product in cart
function updateCartItem(productId, action, quantity = 1){
    fetch('/update-item/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            'productId': productId,
            'action': action,
            'quantity': quantity
        })
    })
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        location.reload();
    })
    .catch(error => {
        console.log(error);
    })
}

function addUpdateCartItemListener(){
    var addToCartBtns = document.querySelectorAll('.add-to-cart');

    addToCartBtns.forEach(function(button){
        button.onclick = function(){
            let productId = this.dataset.product
            let action = this.dataset.action

            if(user === "AnonymousUser"){
                alert('Vui lòng đăng nhập để thực hiện chức năng này');
            }else{
                updateCartItem(productId, action);
            }
        }
    })
}