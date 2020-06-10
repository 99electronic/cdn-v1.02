var form = {
    1: {
        title:'Krok 1/4',
        subtitle: 'Po potvrzení tohoto formuláře vám zašleme email s ověřovacím kódem',
        label: 'Vaše emailová adresa',
        placeholder: 'Email',
        submit: 'Zaslat email pro získání hesla',
        progresschart: {
            items: 4,
            data: {
                0:{
                    active:1,
                    str: 'registrační údaje'
                },
                1:{
                    active:0,
                    str: 'potvrzení emailu'
                },
                2:{
                    active:0,
                    str: 'přihlášení'
                },
                3:{
                    active:0,
                    str: 'využívání služeb'
                }
            }
        }
    },
    2: {
        title:'Krok 2/4',
        subtitle: 'Do pole níže zapište šesti místný kód, který jsme vám zaslali na vaši emailovou adresu',
        label: 'Kód z emailu - pokud jste email do 5ti minut neobdrželi, zkontrolujte prosím složku spamu',
        placeholder: '6-ti místný kód zaslaný do vašeho emailu',
        submit: 'Přihlásit se',
        progresschart: {
            items: 4,
            data: {
                0:{
                    active:1,
                    str: 'registrační údaje'
                },
                1:{
                    active:1,
                    str: 'potvrzení emailu'
                },
                2:{
                    active:0,
                    str: 'přihlášení'
                },
                3:{
                    active:0,
                    str: 'využívání služeb'
                }
            }
        }
    }
}
var step = 1;
var registered_email = null;
var invalid_email = 0;
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
        action: 'register-init',
        check_email: $('#start-with-email').val()
    };
    callAPI_GET(query, function(data) {
        if(data.success) {
            construct_main_menu(data.loginStatus);
            if(validateEmail($('#start-with-email').val())) {
                $('.email').val($('#start-with-email').val());
            }
                step = data.step;
                var f = form[step];
                progresschart(f);
                fillData(f);
        }
        if(data.errors) {
            if(data.errors[0].id == 1) {
                gotoURL(htaccess.home);
            }
            if(data.errors[0].id == 2) {
                gotoURL(htaccess.login, 'nc', '/' + $('#start-with-email').val());
            }
            if(data.errors[0].id == 3) {
                construct_main_menu(data.loginStatus);
                $('#step1,#step2,#progresschart,#alert-container').hide();
                $('#step3').show();
                page_loading('done');
            }
        }

    });
}
function fillData(f) {
    $('#title').html(f.title);
    $('#subtitle').html(f.subtitle);
    $('#label').html(f.label);
    $('.email').on('change input', function () {
        var error = false;
        if($('.email').val() == '') {
            error = '<span class="text-danger"> - emailová adresa je povinná</span>';
        }
        if(!error) {
            if (!validateEmail($('.email').val())) {
                error = '<span class="text-danger"> - neplatná emailová adresa</span>';
            }
        }
        if(!error) {
            email_exists(function(){
                $('#inuse').html('<span class="text-success fa fa-ok"></span>');
            },
                show_error
            );
        } else {
            invalid_email = 1;
            $('#inuse').html(error);
        }
    });
    $('.password,.password_again').on('change input', function () {
        $('.password,.password_again').attr('type', 'password');
        check_password();
    });
   $('#submit').off("click").on("click", function(){
        if(step == 1){
            register();
        }
        if(step == 2) {
            register_verify();
        }
    });
    $('#step1').show();
    $('#step2').hide();
    $('.toggleSwitch').removeClass('fa-toggle-on').addClass('fa-toggle-off');
    $('#switch0').off("click").on("click", function(){
        if($('#switch0_state').val() == 0) {
            $('#switch0').removeClass('fa-toggle-off').addClass('fa-toggle-on');
            $('#switch0_state').val(1);
        } else {
            $('#switch0').removeClass('fa-toggle-on').addClass('fa-toggle-off');
            $('#switch0_state').val(0);
        }
        check_password();
    });
    page_loading('done');
    setTimeout(refresh_recaptcha, 1000);
}

function register() {
    var query = {
        action: 'register-submit',
        email: $('.email').val(),
        password: $('.password').val(),
        password_again: $('.password_again').val(),
        agreement: $('#switch0_state').val(),
        reCaptchaToken: $('#reCaptchaToken').val()
    };
    callAPI_GET(query, function(data) {
        refresh_recaptcha();
        if(data.loginStatus == 'in') {
            gotoURL(htaccess.home);
        } else {
            if (data.success) {
                step = data.step;
                var f = form[step];
                progresschart(f);
                registered_email = data.email;
                $('#title').html(f.title);
                $('#subtitle').html(f.subtitle);
                $('#label').html(f.label);
                $('#submit-button-container').hide();
                $('#code').on('change input', function () {
                    if($('#code').val().length == 6) {
                        $('#submit-button-container').show();
                    } else {
                        $('#submit-button-container').hide();
                    }
                });
                $('#step1').hide();
                $('#step2').show();
            } else {
                var okbutton = false;
                if(data.errors[0].id == 3) {
                    data.errors[0].str = 'Nové registrace nejsou v tuto chvíli povoleny.' +
                    '<br><a href="/">Přejít na hlavní stránku <span class="fa-angle-right"></span></a>';
                    var okbutton = function() {
                        document.location = '/';
                    }
                }
                errormodal(data.errors, 'Chyba', okbutton);
            }
        }
    });
}
function register_verify() {
    var query = {
        action: 'register-verify',
        email: registered_email,
        code: $('#code').val(),
        reCaptchaToken: $('#reCaptchaToken').val()
    };
    callAPI_GET(query, function(data) {
        if(data.success) {
            gotoURL(htaccess.home);
        } else {
            refresh_recaptcha();
            if(data.errors.id = 4) {
                errormodal(data.errors, null, function(){
                    gotoURL(htaccess.login, 'nc', '/'+registered_email);
                });
            } else {
                errormodal(data.errors);
            }
        }
    });
}
function check_password() {
    if(invalid_email) {
        $('#inuse').html('<span class="text-danger"> - tento email je obsazen</span>');
    }
    if($('.password').val().length < 8 && $('.password').val().length > 0) {
        $('#pass1').html('<span class="text-danger"> - heslo je příliš krátké</span>');
    }
    if($('.password').val().length == 0) {
        $('#pass1').html('');
    }
    if($('.password').val().length > 7) {
        $('#pass1').html('<span class="text-success fa fa-check"></span>');
    }
    if($('.password').val().length > 7 && $('.password_again').val().length > 0) {
        if($('.password').val() != $('.password_again').val()) {
            $('#pass2').html('<span class="text-danger"> - hesla se neshodují</span>');
        }
        if($('.password').val() == $('.password_again').val()) {
            $('#pass2').html('<span class="text-success fa fa-check"></span>');
        }
    }
    if(!$('.password').val() && !$('.password_again').val()) {
        $('#pass2').html('');
    }
    if($('.password').val().length > 8
        && $('.password').val() == $('.password_again').val()
        && !invalid_email && $('#switch0_state').val() == 1) {
        $('#submit-button-container').show();
    } else {
        $('#submit-button-container').hide();
    }
}
function email_exists(fn_false, fn_true) {
    var query = {
        action: 'email-exists',
        email: $('.email').val(),
        reCaptchaToken: $('#reCaptchaToken').val()
    };
    callAPI_GET(query, function(data) {
        refresh_recaptcha();
        if(data.success) {
            invalid_email = data.inuse;
            if(data.inuse == 0) {
                fn_false();
            }
            if(data.inuse == 1) {
                fn_true();
            }
        } else {
            invalid_email = 0;
        }
        check_password();
    });
}

function show_error(error) {
    $('#inuse').html(error);
}
