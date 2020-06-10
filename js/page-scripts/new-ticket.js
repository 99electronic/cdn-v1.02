$(document).ready(function() {
    page_loading(
        'start',
        'fa-angle-left',
        'zpět',
        function () {
            history.back();
        }
    );
});
function refresh_page() {
    var query = {
        action: 'check-login'
    };
    callAPI_GET(query, function(data) {
        if (data.success) {
            construct_main_menu(data.loginStatus, data.bulletins);
            messageCountchar();
            $('#submit_button,.fa-check').hide();
            $('#faq').attr('href', htaccess.faq);
            $('#email,#name,#type,#messageSource').on('change input', function () {
                check_form();
            });
            $('#clear-message').on("click", function(){
                $('#messageSource').val('');
                messageCountchar();
                check_form();
            });
            $('#submit_button').on("click", function(){
                new_ticket();
            });
            page_loading('done');
            setTimeout(refresh_recaptcha, 1000);
        }
    });
}
function check_form() {
    var errors = 0;
    $('.fa-check').hide();
    if(!validateEmail($('#email').val()) || $('#email').val().length == 0) {
        errors = 1;
        $('#email-check').hide();
    } else {
        $('#email-check').show();
    }
    if($('#name').val().length < 3) {
        errors = 1;
        $('#name-check').hide();
    } else {
        $('#name-check').show();
    }
    if($('#type').val() == 'non') {
        errors = 1;
        $('#type-check').hide();
    } else {
        $('#type-check').show();
    }
    if($('#messageSource').val().length < 10) {
        errors = 1;
        $('#message-check').hide();
    } else {
        $('#message-check').show();
    }
    if($('#messageSource').val().length == 0) {
        $('#clear-message').hide();
    } else {
        $('#clear-message').show();
    }
    if(errors == 0) {
        $('#submit_button').show();
    } else {
        $('#submit_button').hide();
    }
}
function new_ticket() {
    var post_data = {
        email: $('#email').val(),
        name: $('#name').val(),
        type: $('#type').val(),
        message: b64EncodeUnicode($('#messageSource').val()),
        reCaptchaToken: $('#reCaptchaToken').val()
    };
    callAPI_POST(
        'support-ticket',
        post_data,
        function(data) {
            refresh_recaptcha();
            if (data.success) {
                errormodal(data.success, 'OK', function(){
                    $('#messageSource,#email,#name').val('');
                    messageCountchar();
                    $('#type').val('non');
                    check_form();
                });
            } else {
                errormodal(data.errors);
            }
        });
}