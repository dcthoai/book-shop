
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

// Open form sign in/up when user do not logged in
signBtn.onclick = function(){
    if(isLoggedIn == false){
        isSignIn = true;
        formMain.style.display = 'block';
        formLayer.innerHTML = formSignInHtml;
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
    formLayer.style.marginTop = '0px';
    formLayer.innerHTML = formSignInHtml;
    formTrans[0].classList.add('active');
    formTrans[1].classList.remove('active');
    validateSignIn();
    isSignIn = true;
}

// Function switch to form Sign Up
function viewSignUp(){
    formNav.style.display = 'block';
    formLayer.style.marginTop = '0px';
    formLayer.innerHTML = formSignUpHtml;
    formTrans[1].classList.add('active');
    formTrans[0].classList.remove('active');
    validateSignUp();
    isSignIn = false;
}

function loginSuccess(){
    formMain.style.display = 'none';
    signBtn.style.display = 'none';
    userBtn.style.display = 'block';
    localStorage.setItem('isLoggedIn', 'true');
    setTimeout(function(){
        location.reload();
        alert('Đăng nhập thành công.')
    }, 500);
}

function loginFailed(){
    alert("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin tài khoản.");
}

function signUpSuccess(){
    alert("Đăng ký thành công.");
    viewSignIn();
    validateSignIn();
}

function signUpFailed(){
    alert('Đăng ký thất bại. Mã xác thực sai hoặc hết thời gian hiệu lực, vui lòng thử lại.');
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
            fetch('/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    alert('Yêu cầu đăng ký tài khoản của bạn đã được gửi đi, vui lòng đợi giây lát');
                    verify();
                } else {
                    alert('Gửi yêu cầu thất bại, vui lòng thử lại.');
                }
            })
            .catch((error) => {
                alert('Có lỗi xảy ra, vui lòng thử lại sau.');
                console.error('Error:', error);
            });
        }
    });
}

// Verify account registration code
function verify(){
    formLayer.innerHTML = formVerifyHtml;
    formLayer.style.marginTop = '60px';
    formNav.style.display = 'none';

    var submitVerify = formMain.querySelector('.form__verify .form__verify-submit');
    var cancelVerify = formMain.querySelector('.form__verify .form__verify-cancel');

    submitVerify.addEventListener('click', function(){
        var dataVerify = {};
        var inputElement = document.querySelector('#form-main input[name="verify_code"]');
        dataVerify[inputElement.name] = inputElement.value;

        fetch('/verify/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataVerify),
        })
        .then(reponse => reponse.json())
        .then(data => {
            if(data.success){
                signUpSuccess();
            } else {
                signUpFailed();
            }
        })
        .catch((error) => {
            alert('Có lỗi xảy ra, vui lòng thử lại sau.');
            console.error('Error:', error);
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
            // Call API
            fetch('/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loginSuccess();
                    validateSignIn();
                }else{
                    loginFailed();
                }
            })
            .catch((error) => {
                alert('Có lỗi xảy ra, vui lòng thử lại sau.');
                console.error('Error:', error);
            });
        }
    });
}

function getFormUser(){
    if(formUser.style.display == 'block'){
        formUser.style.display = 'none';
    }else{
        formUser.style.display = 'block';    
        var logoutBtn = formUser.querySelector('.user__logout-btn');
        logoutBtn.onclick = function(){
            fetch('/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                isLoggedIn = false;
                localStorage.setItem('isLoggedIn', 'false');
                location.reload();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }
}

window.addEventListener = ('load', function() {
    var isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        formMain.style.display = 'none';
        signBtn.style.display = 'none';
        userBtn.style.display = 'block';
        userBtn.onclick = function(event){
            event.stopPropagation();
            getFormUser();
        }
    }else{
        signBtn.style.display = 'block';
        isLoggedIn = false
        localStorage.setItem('isLoggedIn', 'false');
    }
});

window.addEventListener('click', function(event){
    if(formUser.style.display == 'block'){
        if(event.target != formUser && event.target != userBtn) {
            formUser.style.display = 'none';
        }
    }
});

window.addEventListener('load', function(){
    var content = document.querySelector('.content__product .product-info .info__decription .info__decription-content');
    var toggle = document.getElementById('toggleDesBook');

    var fullText = content.innerHTML;
    var shortText = fullText;

    if (fullText.length > 200) {
        shortText = fullText.substr(0, 200) + '...';
        toggle.style.display = 'block';
        tongle.innerHTML = 'Xem thêm';
    } else {
        tongle.innerHTML = '';
        toggle.style.display = 'none';
    }

    content.innerHTML = shortText;

    toggle.addEventListener('click', function() {
        if (content.innerHTML === shortText) {
            content.innerHTML = fullText;
            this.innerHTML = 'Thu gọn';
        } else {
            content.innerHTML = shortText;
            this.innerHTML = 'Xem thêm';
        }
    });
});