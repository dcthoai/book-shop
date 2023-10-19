
const termsOfUseHTML = `
    <p>Chào mừng quý khách đến mua sắm tại ABCBook. Sau khi truy cập vào website ABCBook 
    để tham khảo hoặc mua sắm, quý khách đã đồng ý tuân thủ và ràng buộc với những quy định của ABCBook. 
    Vui lòng xem kỹ các quy định và hợp tác với chúng tôi để xây dựng 1 website ABCBook 
    ngày càng thân thiện và phục vụ tốt những yêu cầu của chính quý khách. Ngoài ra, nếu có 
    bất cứ câu hỏi nào về những thỏa thuận trên đây, vui lòng email cho chúng tôi qua địa chỉ
    <a href="">support@ABCBook.com</a>
    </p>
    <h4>Tài khoản của khách hàng</h4>
    <p>Khi sử dụng dịch vụ ABCBook, quý khách sẽ cung cấp cho chúng tôi thông tin về địa chỉ email, 
    mật khẩu và họ tên để có được 1 tài khoản tại đây. Việc sử dụng và bảo mật thông tin tài khoản 
    là trách nhiệm và quyền lợi của quý khách khi sử dụng ABCBook. Ngoài ra, những thông tin khác 
    trong tài khoản như tên tuổi, địa chỉ.... là những thông tin sẽ giúp ABCBook phục vụ quý khách tốt nhất. 
    Trong trường hợp thông tin do quý khách cung cấp không đầy đủ hoặc sai dẫn đến việc không 
    thể giao hàng cho quý khách, chúng tôi có quyền đình chỉ hoặc từ chối phục vụ, giao hàng mà 
    không phải chịu bất cứ trách nhiệm nào đối với quý khách. Khi có những thay đổi thông tin của quý khách, 
    vui lòng cập nhật lại thông tin trong tài khoản trong phần thông tin tài khoản. 
    Quý khách phải giữ kín mật khẩu và tài khoản, hoàn toàn chịu trách nhiệm đối với tất cả 
    các hoạt động diễn ra thông qua việc sử dụng mật khẩu hoặc tài khoản của mình. Quý khách nên 
    đảm bảo thoát khỏi tài khoản tại ABCBook sau mỗi lần sử dụng để bảo mật thông tin của mình.
    </p>
    <h4>Quyền lợi bảo mật thông tin của khách hàng</h4>
    <p>Khi sử dụng dịch vụ tại website ABCBook, quý khách được đảm bảo rằng những thông tin cung cấp cho 
    chúng tôi sẽ chỉ được dùng để nâng cao chất lượng dịch vụ dành cho khách hàng của ABCBook và 
    sẽ không được chuyển giao cho 1 bên thứ ba nào khác vì mục đích thương mại. Thông tin của quý khách 
    tại ABCBook sẽ được chúng tôi bảo mật và chỉ trong trường hợp pháp luật yêu cầu, chúng tôi sẽ buộc 
    phải cung cấp những thông tin này cho các cơ quan pháp luật.
    </p>
    <h4>Trách nhiệm của khách hàng khi sử dụng dịch vụ của ABCBook</h4>
    <p>Quý khách tuyệt đối không được sử dụng bất kỳ công cụ, phương pháp nào để can thiệp, xâm nhập 
    bất hợp pháp vào hệ thống hay làm thay đổi cấu trúc dữ liệu tại website ABCBook. 
    Quý khách không được có những hành động (thực hiện, cổ vũ) việc can thiệp, xâm nhập dữ liệu 
    của ABCBook cũng như hệ thống máy chủ của chúng tôi. Ngoài ra, xin vui lòng thông báo cho 
    quản trị web của ABCBook ngay khi quý khách phát hiện ra lỗi hệ thống theo số điện thoại 
    <span>0123456789</span> hoặc email <a href="">support@ABCBook.com</a>
    </p>
    <p>Quý khách không được đưa ra những nhận xét, đánh giá có ý xúc phạm, quấy rối, làm phiền hoặc 
    có bất cứ hành vi nào thiếu văn hóa đối với người khác. Không nêu ra những nhận xét có tính 
    chính trị (tuyên truyền, chống phá, xuyên tạc chính quyền), kỳ thị tôn giáo, giới tính, sắc tộc....
    Tuyệt đối cấm mọi hành vi mạo nhận, cố ý tạo sự nhầm lẫn mình là một khách hàng khác hoặc 
    là thành viên Ban Quản Trị ABCBook.
    </p>
    <h4>Trách nhiệm và quyền lợi của ABCBook</h4>
    <p>Trong trường hợp có những phát sinh ngoài ý muốn hoặc trách nhiệm của mình, ABCBook sẽ không 
    chịu trách nhiệm về mọi tổn thất phát sinh. Ngoài ra, chúng tôi không cho phép các tổ chức, 
    cá nhân khác quảng bá sản phẩm tại website ABCBook mà chưa có sự đồng ý bằng văn bản từ đội ngũ ABCBook. 
    Các thỏa thuận và quy định trong Điều khoản sử dụng có thể thay đổi vào bất cứ lúc nào 
    nhưng sẽ được chúng tôi thông báo cụ thể trên website ABCBook.
    </p>
`;

document.getElementById('terms-of-use').innerHTML = termsOfUseHTML;
var buttonControls = document.querySelectorAll('.personal .controls .nav__item');
var items = document.querySelectorAll('.personal .details .wrapper');
// Variable for form change avatar
var container = document.querySelector('.personal .container');
var formAvatar = document.querySelector('.personal .form-avatar');
var formAvatarClose = formAvatar.querySelector('.form__close');
var formAvatarSubmit = formAvatar.querySelector('.form__submit-btn');
var formAvatarDemo = formAvatar.querySelector('.form__content-demo img');
var chooseFileAvatar = document.getElementById('file-avatar');
var changeAvatarBtn = document.getElementById('change-avatar');
var personalAvatar = document.getElementById('avatar');

// Change avatar image for account
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

// POST request change avatar image
formAvatarSubmit.onclick = function(){
    if(container.style.display == 'block'){
        container.style.display = 'none';
        loaddingElement.style.display = 'block';

        var formData = new FormData();
        var fileAvatar = chooseFileAvatar.files[0];
        formData.append('avatar', fileAvatar);

        fetch('/api/update-avatar/', {
            method: 'POST',
            headers: {
                // Content-Type is generated by the browser
                'X-CSRFToken': csrftoken
            },
            body: formData
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
            }else{
                alert(data.error);
            }
        })
        .catch(error => {
            loaddingElement.style.display = 'none';
            alert(error);
        });
    }
};

// Add event click to open for forms-group
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
        formChange.querySelectorAll('input').forEach(function(item){
            item.value = '';
        })
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

// Add animation when open/close form-group
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

var userId;
// Get user id when account page is loaded
document.addEventListener('DOMContentLoaded', (event) => {
    if (window.location.pathname === '/account/') {
        fetch('/api/user-id/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
        })
        .then(response => response.json())
        .then(data => {
            userId = data.id;
        })
        .catch(error => {
            alert(error);
        })
    }
});

// Change and update user informations
var formsChange = document.querySelectorAll('.personal .details .details__info .form-change');
var formAccount = document.querySelector('.personal .form-account')
var formLayerAccount = formAccount.querySelector('.form__layer');
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

// Function to change and update user informations: fullname, username, email, phone number
formsChange.forEach(function(formChange){
    var inputElement = formChange.querySelector('.form__body-input');
    var buttonChange = formChange.querySelector('.form__body-submit');

    buttonChange.addEventListener('click', function(){
        var data = inputElement.value;
        let isEmail = inputElement.name == 'email';

        if (data.trim() !== ''){
            loaddingElement.style.display = 'block';

            fetch('/api/update-account/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
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

                if(data.success){
                    if(isEmail){
                        verifyChangeEmail();
                    }else{
                        setTimeout(function(){
                            location.reload();
                        }, 200);
                    }
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
})

// Authenticate when the user wants to change the account email
function verifyChangeEmail(){
    formAccount.style.display = 'block';
    formLayerAccount.innerHTML = formVerifyEmail;
    var formInputEmail = formLayerAccount.querySelector('.form__verify-input');
    var formAccountSubmit = formLayerAccount.querySelector('.form__verify-submit');
    var formAccountCancel = formLayerAccount.querySelector('.form__verify-cancel');
    var formAccountClose = formAccount.querySelector('.form__close-btn');

    formAccountClose.addEventListener('click', function(){
        formAccount.style.display = 'none';
    })

    // POST request verify new email
    formAccountSubmit.addEventListener('click', function(){
        loaddingElement.style.display = 'block';
        let data = formInputEmail.value

        fetch('/api/verify-change-email/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
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
                    alert(data.success);
                }, 200);
            }else{
                alert(data.error);
            }
        })
        .catch(error => {
            loaddingElement.style.display = 'none';
            alert(error);
        })
    })

    formAccountCancel.addEventListener('click', function(){
        formAccount.style.display = 'none';
        formLayerAccount.innerHTML = '';
    })
}

// Change account password
var formChangePassword = document.querySelector('.personal .details .form-change-password');
var formGroupBoxPassword = formChangePassword.parentElement.querySelector('.form__group-box');
var formChangePasswordInput = formChangePassword.querySelectorAll('input');
var submitPassword = formChangePassword.querySelector('.form__body-submit');

// Validator data in form change password
function validate(item, message = 'Trường này là bắt buộc'){
    let value = item.value.trim();
    if(value.length >= 8){
        item.classList.remove('invalid');
        item.previousElementSibling.innerHTML = message;
        item.previousElementSibling.style.display = 'none';
        openFormChange(formChangePassword.parentNode);
        return false;
    }else{
        item.previousElementSibling.innerHTML = 'Trường này là bắt buộc.';
        if(value !== ''){
            item.previousElementSibling.innerHTML = message;
        }
        item.classList.add('invalid');
        item.previousElementSibling.style.display = 'block';
        openFormChange(formChangePassword.parentNode);
        return true;
    }
}

// Clear data in form change when user close form
formGroupBoxPassword.addEventListener('click', function(){
    clearFormChangePass();
    clearFormRecoverPass();
})

function clearFormChangePass(){
    formChangePasswordInput.forEach(function(item){
        item.classList.remove('invalid');
        item.previousElementSibling.innerHTML = 'Trường này là bắt buộc';
        item.previousElementSibling.style.display = 'none';
    });
}

formChangePasswordInput.forEach(function(item){
    item.onblur = function(){
        validate(item, 'Vui lòng nhập tối thiểu 8 kí tự.');
    }

    item.oninput = function(){
        validate(item, 'Vui lòng nhập tối thiểu 8 kí tự.');
    }
});

// POST request to change password
submitPassword.addEventListener('click', function(){
    let isValid = false;
    formChangePasswordInput.forEach(function(item){
        isValid = validate(item, 'Vui lòng nhập tối thiểu 8 kí tự.');
    });

    if(!isValid){
        loaddingElement.style.display = 'block';
        let dataPassword = {userId: userId};

        formChangePasswordInput.forEach(function(item){
            dataPassword[item.name] = item.value.trim();
        });

        fetch('/api/change-password/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify(dataPassword)
        })
        .then(response => response.json())
        .then(data => {
            loaddingElement.style.display = 'none';

            if(data.success){
                alert('Mật khẩu của bạn đã được thay đổi, vui lòng đăng nhập lại.');
                loggedOut();
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

// Log out account when change password success
function loggedOut(){
    fetch('/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('isLoggedIn', 'false');
        window.location.href = '/';
    })
    .catch((error) => {
        alert(error);
    });
}

var formRecoverPassword = document.querySelector('.personal .details .form-forgot-password');
var formGroupBoxRecoverPass = formRecoverPassword.parentElement.querySelector('.form__group-box');
var emailRecover = formRecoverPassword.querySelector('input[name="email-recover"]');
var submitEmailRecover = formRecoverPassword.querySelector('.form__body-submit');
var errorMessage1 = formRecoverPassword.querySelector('.error-message');

// Clear data in form change when user close form
function clearFormRecoverPass(){
    emailRecover.classList.remove('invalid');
    emailRecover.previousElementSibling.innerHTML = 'Trường này là bắt buộc';
    emailRecover.previousElementSibling.style.display = 'none';
}

formGroupBoxRecoverPass.addEventListener('click', function(){
    clearFormRecoverPass();
    clearFormChangePass();
})

// Validator email in form recover password
function checkEmailRecoverPassword(email, message = 'Trường này là bắt buộc.'){
    let re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    
    if(re.test(email)){
        emailRecover.classList.remove('invalid');
        errorMessage1.style.display = 'none';
        errorMessage1.innerHTML = '';
        openFormChange(formRecoverPassword.parentNode);
        return true;
    }else{
        errorMessage1.innerHTML = 'Trường này là bắt buộc.';
        if(email !== ''){
            errorMessage1.innerHTML = message;
        }
        emailRecover.classList.add('invalid');
        errorMessage1.style.display = 'block';
        openFormChange(formRecoverPassword.parentNode);
        return false;
    }
}

emailRecover.onblur = function(){
    checkEmailRecoverPassword(emailRecover.value.trim(), 'Vui lòng nhập email đã đăng ký tài khoản này.');
}

emailRecover.oninput = function(){
    checkEmailRecoverPassword(emailRecover.value.trim(), 'Vui lòng nhập email đã đăng ký tài khoản này.');
}

// POST request send an email to recover password
submitEmailRecover.addEventListener('click', function(){
    let emailAddress = emailRecover.value.trim();
    
    if(checkEmailRecoverPassword(emailAddress, 'Vui lòng nhập email đã đăng ký tài khoản này.')){
        loaddingElement.style.display = 'block';

        fetch('/api/recover-password/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                userId: userId,
                email_recover: emailAddress
            })
        })
        .then(response => response.json())
        .then(data => {
            loaddingElement.style.display = 'none';

            if(data.success){
                verifyCodeRecover();
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

// Validator verify code to recover
function verifyCodeRecover(){
    formAccount.style.display = 'block';
    formLayerAccount.innerHTML = formVerifyEmail;
    var formCodeRecover = formLayerAccount.querySelector('.form__verify-input');
    var formAccountSubmit = formLayerAccount.querySelector('.form__verify-submit');
    var formAccountCancel = formLayerAccount.querySelector('.form__verify-cancel');
    var formAccountClose = formAccount.querySelector('.form__close-btn');

    formAccountClose.addEventListener('click', function(){
        formAccount.style.display = 'none';
    })

    formAccountSubmit.addEventListener('click', function(){
        loaddingElement.style.display = 'block';
        let codeRecover = formCodeRecover.value

        fetch('/api/verify-recover-password/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                verify_code: codeRecover,
                userId: userId
            })
        })
        .then(response => response.json())
        .then(data => {
            loaddingElement.style.display = 'none';

            if(data.success){
                createNewPassword();
            }else{
                alert(data.error);
            }
        })
        .catch(error => {
            loaddingElement.style.display = 'none';
            alert(error);
        })
    })

    formAccountCancel.addEventListener('click', function(){
        formAccount.style.display = 'none';
        formLayerAccount.innerHTML = '';
    })
}

// Create a new password when email recover is authenticate
function createNewPassword(){
    formLayerAccount.innerHTML = formRecoverPasswordHTML;
    var formAccountSubmit = formLayerAccount.querySelector('.form__verify-submit');
    var formCreateNewPassword = formLayerAccount.querySelector('.form__verify-input');
    var formAccountClose = formAccount.querySelector('.form__close-btn');

    formAccountClose.addEventListener('click', function(){
        formLayerAccount.innerHTML = '';
        formAccount.style.display = 'none';
    })

    formCreateNewPassword.onblur = function(){
        validateNewPassword(this, 'Vui lòng nhập tối thiểu 8 kí tự.');
    }

    formCreateNewPassword.oninput = function(){
        validateNewPassword(this, 'Vui lòng nhập tối thiểu 8 kí tự.');
    }

    formAccountSubmit.addEventListener('click', function(){
        if(!validateNewPassword(formCreateNewPassword, 'Vui lòng nhập tối thiểu 8 kí tự.')){
            loaddingElement.style.display = 'block';

            fetch('/api/recover-success/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({
                    new_password: formCreateNewPassword.value.trim(),
                    userId: userId
                })
            })
            .then(response => response.json())
            .then(data => {
                loaddingElement.style.display = 'none';
        
                if(data.success){
                    alert(data.success)
                    loggedOut();
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