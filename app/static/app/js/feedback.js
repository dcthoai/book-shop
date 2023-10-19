var customerName = document.querySelector('.footer .contact__form input[name="name"]');
var customerEmail = document.querySelector('.footer .contact__form input[name="email"]');
var customerMessage = document.querySelector('.footer .contact__form input[name="message"]');
var sendFeedbackButton = document.getElementById('send-feedback');

sendFeedbackButton.addEventListener('click', function(){
    if(customerName.value.trim() == '' || customerEmail.value.trim() == '' || customerMessage.value.trim() == ''){
        alert('Vui lòng nhập đủ thông tin vào biểu mẫu trước khi gửi');
    }else{
        sendFeedback();
    }
})

function sendFeedback(){
    loaddingElement.style.display = 'block';

    fetch('/feedback/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            name: customerName.value.trim(),
            email: customerEmail.value.trim(),
            message: customerMessage.value.trim(),
        })
    })
    .then(response => response.json())
    .then(data => {
        loaddingElement.style.display = 'none';
        customerName.value = '';
        customerEmail.value = '';
        customerMessage.value = '';

        if(data.success){
            alert(data.success);
        }else{
            alert(data.error);
        }
    })
    .catch(error => {
        loaddingElement.style.display = 'none';
        console.error(error);
    })
}