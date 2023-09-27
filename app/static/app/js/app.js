
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
var formCloseBtn = formMain.querySelector('.form__close-btn');
var userBtn = document.getElementById('user-btn');

signBtn.onclick = function(){
    if(isLoggedIn == false){
        isSignIn = true;
        formMain.style.display = 'block';
        formMain.querySelector('.form__layer').innerHTML = formSignInHtml;
        validateSignIn();
    }
}

formCloseBtn.onclick = function(){
    formMain.style.display = 'none';
}

var formTrans = formMain.querySelectorAll('.form__nav-btn');

formTrans[0].addEventListener('click', function(){
    formMain.querySelector('.form__layer').innerHTML = formSignInHtml;
    formTrans[0].classList.add('active');
    formTrans[1].classList.remove('active');
    validateSignIn();
    isSignIn = true;
});

formTrans[1].addEventListener('click', function(){
    formMain.querySelector('.form__layer').innerHTML = formSignUpHtml;
    formTrans[1].classList.add('active');
    formTrans[0].classList.remove('active');
    validateSignUp();
    isSignIn = false;
});

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
            verify(data);
        }
    });
}

function verify(data){
    formMain.querySelector('.form__layer').innerHTML = formVerifyHtml;
    formMain.querySelector('.form__layer').style.marginTop = '60px';
    formMain.querySelector('.form__nav').style.display = 'none';

    fetch('/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {        
    })
    .catch((error) => {
        console.error('Error:', error);
    });

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
            isSignIn = true;
            formMain.querySelector('.form__nav').style.display = 'block';
            formMain.querySelector('.form__layer').style.marginTop = '0px';
            formMain.querySelector('.form__layer').innerHTML = formSignInHtml;
            formTrans[0].classList.add('active');
            formTrans[1].classList.remove('active');
            validateSignIn();
        })
        .catch((error) => {
            console.error('Error:', error);
        })
    });

    cancelVerify.addEventListener('click', function(){
        isSignIn = false;
        formMain.querySelector('.form__nav').style.display = 'block';
        formMain.querySelector('.form__layer').style.marginTop = '0px';
        formMain.querySelector('.form__layer').innerHTML = formSignUpHtml;
        formTrans[1].classList.add('active');
        formTrans[0].classList.remove('active');
        validateSignUp();
    });
}

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
                if (data.message === 'User logged in successfully') {
                    loginSuccess();
                }else{
                    alert("Email hoặc mật khẩu chưa đúng.");
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    });
}

var moreBook = document.querySelector("#more-book-btn");

if(moreBook){
    moreBook.onclick = function(){
        var content = document.querySelector(".content .wrapper");

        for(var i=0; i<10; ++i){
            content.insertAdjacentHTML('beforeend', `
                <div class="book">
                    <a href="" class="book__link">
                        <div class="book__img" style="background-image: url(${staticURL}app/images/shin.jpg);"></div>
                        <div class="book__info">
                            <h4 class="info__name">Mua sách đê các bạn ơi. Giảm giá 50%</h4>
                            <h4 class="info__price">9.000đ</h4>
                        </div>
                    </a>

                    <button data-product="" data-action="add" class="add-to-cart">Thêm vào giỏ hàng</button>
                </div>
            `);
        }
    }
}

function loginSuccess(){
    formMain.style.display = 'none';
    signBtn.style.display = 'none';
    userBtn.style.display = 'block';
    localStorage.setItem('isLoggedIn', 'true');
    setTimeout(function() {
        location.reload();
    }, 1000);
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

function loginFailed(){
    alert("Đăng nhập thất bại.");
    location.reload();
}

function signUpSuccess(){
    alert("Đăng ký thành công.");
    location.reload();
}

function signUpFailed() {
    alert("Đăng ký thất bại.");
    location.reload();
}

var formUser = document.getElementById('user-form');
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

window.onclick = function(event){
    if(formUser.style.display == 'block'){
        if(event.target != formUser && event.target != userBtn) {
            formUser.style.display = 'none';
        }
    }
}

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