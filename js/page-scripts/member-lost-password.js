var form = {
    1: {
        title:'Krok 1/3',
        subtitle: 'Po potvrzení tohoto formuláře vám zašleme email s kódem pro přihlášení',
        label: 'Emailová adresa vašeho účtu',
        placeholder: 'Email',
        submit: 'Zaslat email pro získání hesla',
        progresschart: {
            items: 3,
            data: {
                0:{
                    active:1,
                    str: 'váš email'
                },
                1:{
                    active:0,
                    str: 'potvrzení linkem-kódem'
                },
                2:{
                    active:0,
                    str: 'přihlášení-nové heslo'
                },
            }
        }
    },
    2: {
        title:'Krok 2/3',
        subtitle: 'Na vámi uvedenou emailovou adresu jsme zaslali kód. Ten je nutné zadat do pole níže',
        label: 'Kód z emailu - pokud jste email do 5ti minut neobdrželi, zkontrolujte prosím složku spamu',
        placeholder: '6-ti místný kód zaslaný do vašeho emailu',
        submit: 'Přihlásit se',
        progresschart: {
            items: 3,
            data: {
                0:{
                    active:1,
                    str: 'váš email'
                },
                1:{
                    active:1,
                    str: 'potvrzení linkem-kódem'
                },
                2:{
                    active:0,
                    str: 'přihlášení-nové heslo'
                },
            }
        }
    }
}
$(document).ready(function() {
    page_loading(
        'start',
        'fa-angle-left',
        'na přihlášení',
        function(){
            gotoURL(htaccess.login);
        }
    )
});
function refresh_page() {
    $('#submit_container').hide();
    var query = {
        action: 'lostpass-init'
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus);
        if(data.loginStatus == 'in') {
            gotoURL(htaccess.home);
        } else {
            step = data.step;
            var f = form[step];
            progresschart(f);
            fillData(f);
            page_loading('done');
            setTimeout(refresh_recaptcha, 1000);
        }
    });
}
function fillData(f) {
    $('#title').html(f.title);
    $('#subtitle').html(f.subtitle);
    $('#label').html(f.label);
    $('#input').prop('placeholder',f.placeholder);
    $('#submit').html(f.submit);
    $('#input').on('change input', function () {
        if (validateEmail($('#input').val()) && $('#input').val()) {
            $('#submit').off("click").on("click", function () {
                submit_email();
            });
            $('#submit_container').show();
        } else {
            $('#submit_container').hide();
        }
    });
}
function submit_email() {
        var query = {
            action: 'lostpass-email',
            email: $('#input').val(),
            tfa: $('#prompt-input').val(),
            reCaptchaToken: $('#reCaptchaToken').val()
        };
        callAPI_GET(query, function (data) {
            refresh_recaptcha();
            if (data.loginStatus == 'in') {
                gotoURL(htaccess.home);
            } else {
                if (data.success) {
                    step = data.step;
                    var f = form[step];
                    progresschart(f);
                    $('#email').val(data.email);
                    $('#input').val('');
                    $('#title').html(f.title);
                    $('#subtitle').html(f.subtitle);
                    $('#label').html(f.label);
                    $('#input').prop('placeholder', f.placeholder).css('text-align', 'center');
                    $('#submit').html(f.submit);
                    $('#modalprompt').modal('hide');
                    $('#input').off('change input');
                    $('#submit').off("click").on("click", function () {
                        submit_code();
                    });
                } else {
                    if (data.errors[0].id == 5 || data.errors[0].id == 6) {
                        $('#prompt-header').html('2FA autentifikace');
                        $('#prompt-message').html(errcolor(data.errors[0]));
                        $('#prompt-input').prop('placeholder', 'Zadejte 2FA kód').val('');
                        $('#modalprompt').modal('show');
                        $('#cb2_prompt').off("click").on("click", function(){
                            submit_email();
                        });
                    } else {
                        $('#modalprompt').modal('hide');
                        errormodal(data.errors);
                    }
                }
            }
        });
}
function submit_code() {
    var query = {
        action: 'lostpass-code',
        email: $('#email').val(),
        code: $('#input').val(),
        reCaptchaToken: $('#reCaptchaToken').val()
    };
    callAPI_GET(query, function (data) {
        if (data.loginStatus == 'in') {
            gotoURL(htaccess.home);
        } else {
            if (data.success) {
                gotoURL(htaccess.home);
            } else {
                refresh_recaptcha();
                errormodal(data.errors);
            }
        }
    });
}