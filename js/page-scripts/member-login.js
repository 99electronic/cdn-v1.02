var submit = 'login';
$(document).ready(function() {
    page_loading(
        'start',
        'fa-angle-left',
        'na hlavní stránku',
        function () {
            gotoURL(htaccess.home);
        });
});
function refresh_page() {
    var query = {
        action: 'check-login'
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if(data.loginStatus == 'in') {
            gotoURL(htaccess.home);
        }
        fillData();
        page_loading('done');
        setTimeout(refresh_recaptcha, 1000);
    });
}
function fillData() {
    if($('#passed_email').val()) {
        $('#autologoff').html('Přihlašte se svou emailovou adresou');
        $('#email').val($('#passed_email').val());
        setTimeout(function () {
            $('#password').get(0).focus();
        }, 200);
    } else {
        setTimeout(function () {
            $('#email').get(0).focus();
        }, 1000);
        $('#autologoff').html('');
    }
    $('#login-button').off("click").on("click", function(){
        submit_form();
    });
    $('#request-verify').off("click").on("click", function(){
        open_verify_form();
    });
    $('#captcha-reload').off("click").on("click", function(){
        captchaimg('captcha');
    });
}
function submit_form() {
    if(submit == 'login') {
        login();
    }
    if(submit == 'verify') {
        verify();
    }
    if(submit == 'request') {
        request_new_code();
    }
}
function login() {
    var query = {
        action: 'login',
        email: $('#email').val(),
        password: $('#password').val(),
        tfa: $('#tfa').val(),
        reCaptchaToken: $('#reCaptchaToken').val()
    };
    callAPI_GET(query, function(data) {
        refresh_recaptcha();
        if(data.loginStatus == 'in') {
            gotoURL(htaccess.home);
        } else {
            $('.containers').hide();
            //requesting TFA
            if(data.errors[0].id == 6) {
                $('#tfa-error').html('Kód dvoufázové autentifikace');
                $('#tfa-container').show('slow');
                data.errors = false;
            }
            //invalid TFA
            if(data.errors[0].id == 7) {
                $('#tfa-error').html('Kód dvoufázové autentifikace je neplatný');
                $('#tfa-container').show('slow');
                data.errors = false;
            }
            //requesting activation
            if(data.errors[0].id == 5) {
                $('#verify-container').show('slow');
                submit = 'verify';
                data.errors = false;
            }
            //login success
            if(data.success) {
                gotoURL(htaccess.home);
            }
            if(data.errors) {
                errormodal(data.errors);
            }
        }
    });
}
function verify() {
    var query = {
        action: 'register-verify',
        email: $('#email').val(),
        code: $('#verify-code').val(),
        reCaptchaToken: $('#reCaptchaToken').val()
    };
    callAPI_GET(query, function(data) {
        if(data.loginStatus == 'in') {
            gotoURL(htaccess.home);
        } else {
            if(data.success) {
                gotoURL(htaccess.home);
            } else {
                refresh_recaptcha();
                $('#verify-code').val('')
                errormodal(data.errors, null, function(){
                    $('#verify-code').get(0).focus();
                });
            }

        }
    });
}
function open_verify_form() {
    refresh_recaptcha();
    $('.containers').hide();
    $('#request-verify-container').show('slow', function(){
        captchaimg('captcha');
        submit = 'request';
    });

}
function request_new_code() {
    var query = {
        action: 'new-verify-code',
        email: $('#email').val(),
        form: 'login',
        captcha_code: $('#captcha_code').val(),
        reCaptchaToken: $('#reCaptchaToken').val()
    };
    callAPI_GET(query, function(data) {
        refresh_recaptcha();
        if(data.success) {
            $('.containers').hide();
            $('#verify-container').show('slow');
            submit = 'verify';
        } else {
            errormodal(data.errors);
        }
    });
}
function captchaimg(obj) {
    obj = $('#'+obj);
    var query = {
        action: 'captcha-img',
        form: 'login',
        reCaptchaToken: $('#reCaptchaToken').val()
    };
    callAPI_GET(query, function(data) {
        refresh_recaptcha();
        if(data.captcha.src) {
            obj.prop('src', data.captcha.src).css('width', data.captcha.width, 'height', data.captcha.height);
        }
    });
}