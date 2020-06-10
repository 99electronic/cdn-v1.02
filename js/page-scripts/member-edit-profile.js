var email = '';
var address = '';
var loggedByEmail = 0;
var cancel_email_change = 0;
$(document).ready(function() {
    page_loading(
        'start',
        'fa-angle-left',
        'zpět',
        function(){
            history.back();
        });
    $('body').on('shown.bs.modal', '#modalprompt', function () {
        $('input:visible:enabled:first', this).focus();
    });
});
function refresh_page() {
    var query = {
        action: 'profile-form'
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if(data.loggedUser.changePassword) {
            loggedByEmail = 1;
            $('#change-pass-info').show();
            $('#email,#address-name,#address-street,#address-city,#address-zip').prop('disabled', true);
            $('#tfa_link').html('Vypnout/zapnout dvoufázovou autentifikaci nelze dokud se nepřihlásíte heslem');
        } else {
            loggedByEmail = 0;
            $('#change-pass-info').hide();
            $('#email,#address-name,#address-street,#address-city,#address-zip').prop('disabled', false);
        }
        if(data.success) {
            email = data.loggedUser.email;
            address = data.profile.address;
            fillData(data);
        } else {
            errormodal(data.errors);
        }
        page_loading('done');
        setTimeout(refresh_recaptcha, 1000);
    });
}
function fillData(data) {
    $('#submit_new_email,#submit_new_password,#submit_new_address').hide();
    $('#email').val(data.loggedUser.email);
    $('#email').on('change input', function () {
        if(validateEmail($('#email').val()) && $('#email').val() && $('#email').val() != email) {
            check_email_exists();
        } else {
            $('#submit_new_email').hide();
        }
    });
    if(data.profile.tfa == 0) {
        $('#tfa_link').html('Povolit dvoufázovou autentifikaci - zvýšit bezbečnost účtu ' +
            '<span class="text-link" id="enable_tfa"> - zde <span class="fa fa-angle-right"></span></span>');
    } else {
        $('#tfa_link').html('Vypnout dvoufázovou autentifikaci' +
            '<span class="text-link" id="disable_tfa"> - zde <span class="fa fa-angle-right"></span></span>');
    }
    $('#enable_tfa').off("click").on("click",function(){
        gotoURL(htaccess.tfa, 'nc');
    });
    $('#logout_everywhere').off("click").on("click", logout_everywhere);
    $('#disable_tfa').off("click").on("click",function(){
        password_prompt(disable_tfa);
    });
    $('#nomatch,#match').html('');
    $('#new_password,#new_password_again').on('change input', function () {
        $('#new_password,#new_password_again').attr('type', 'password');
        check_new_password();
    });
    $('#address-name').val(address['name']);
    $('#address-street').val(address['street']);
    $('#address-city').val(address['city']);
    $('#address-zip').val(address['zip']);
    $('#address-name,#address-street,#address-city,#address-zip').on('change input', function () {
        var address_hash = calcMD5((b64EncodeUnicode(
            $('#address-name').val() +
            $('#address-street').val() +
            $('#address-city').val() +
            $('#address-zip').val()
        )));
        if($('#address-name').val() +
            $('#address-street').val() +
            $('#address-city').val() +
            $('#address-zip').val() == '') {
            if(address['name']+address['street']+address['city']+address['zip'] == '') {
                var clear_address = 0;
            } else {
                var clear_address = 1;
            }
        } else {
            var clear_address = 0;
        }
        if((address_hash != address.hash
            && $('#address-name').val() && $('#address-street').val()
            && $('#address-city').val() && $('#address-zip').val().length == 5)
            || clear_address == 1) {
            $('#submit_new_address').off("click").on("click", function(){
                password_prompt(update_address);
            });
            $('#submit_new_address').show();
        } else {
            $('#submit_new_address').hide();
        }
    });
    $('#change-email-button-submit').off("click").on("click", function(){
        cancel_email_change = 0;
        password_prompt(update_email_finish);
    });
    $('#change-email-button-cancel').off("click").on("click", function(){
        cancel_email_change = 1;
        password_prompt(update_email_finish);
    });
    $('.toggleSwitch').removeClass('fa-toggle-on').addClass('fa-toggle-off');
    toggle_switch(0, data.profile.email_allow[0]);
    toggle_switch(1, data.profile.email_allow[1]);
    toggle_switch(2, data.profile.email_allow[2]);
    toggle_switch(3, data.profile.email_allow[3]);
    $('#switch0').off("click").on("click", function() {
        set_email_allow(0);
    });
    $('#switch1').off("click").on("click", function() {
        set_email_allow(1);
    });
    $('#switch2').off("click").on("click", function() {
        set_email_allow(2);
    });
    $('#switch3').off("click").on("click", function() {
        set_email_allow(3);
    });
    update_email_form(data.profile.newemail);
    $('#back-link').off("click").on("click",function(){
        gotoURL(htaccess.home, 'nc');
    });
}
function update_email_form(email) {
    if(email != 0 && loggedByEmail == 0) {
        $('#change-email').show();
        $('#newemail').html(email);
    } else {
        $('#newemail').html('');
        $('#change-email').hide();
    }
}
function check_new_password() {
    if($('#new_password').val().length > 7 && $('#new_password').val() == $('#new_password_again').val()) {
        $('#submit_new_password').show();
        $('#submit_new_password').off("click").on("click", function(){
            if(loggedByEmail == 0) {
                password_prompt(update_password);
            } else {
                update_password();
            }
        });
        $('#nomatch').html('');
        $('#match').html('<span class="fa fa-check"></span>');
    } else {
        $('#match').html('');
        $('#submit_new_password').hide();
        if($('#new_password').val().length < 8 && $('#new_password').val().length > 0) {
            $('#nomatch').html(' - heslo je příliš krátké');
        } else {
            if($('#new_password').val() || $('#new_password_again').val()) {
                $('#nomatch').html(' - hesla se neshodují');
            } else {
                $('#nomatch').html('');
            }
        }
        if($('#new_password_again').val().length > 0 && $('#new_password').val().length > 7) {
            $('#nomatch').html(' - hesla se neshodují');
        } else {
            if($('#new_password').val().length < 8 && $('#new_password').val().length > 0) {
                $('#nomatch').html(' - heslo je příliš krátké');
            }
        }
    }
    if($('#new_password').val() == '' && $('#new_password_again').val() && $('#nomatch').html() == '') {
        $('#nomatch').html(' - hesla se neshodují');
    }
}
function toggle_switch(i, state) {
    if(state == 0) {
        $('#switch'+i).removeClass('fa-toggle-on').addClass('fa-toggle-off')
    } else {
        $('#switch'+i).removeClass('fa-toggle-off').addClass('fa-toggle-on')
    }
}
function set_email_allow(i) {
    var query = {
        action: 'profile-email-subscribe',
        i: i
    };
    callAPI_GET(query, function(data) {
        if(data.success) {
            toggle_switch(data.i, data.new_state);
        }
    });
}
function check_email_exists() {
    var query = {
        action: 'email-exists',
        email: $('#email').val(),
        reCaptchaToken: $('#reCaptchaToken').val()
    };
    callAPI_GET(query, function(data) {
        refresh_recaptcha();
        if(data.inuse) {
            $('#submit_new_email').hide();
            $('#inuse').html(' - email je již registrován');
        } else {
            $('#submit_new_email').off("click").on("click", function(){
                password_prompt(update_email);
            });
            $('#submit_new_email').show();
            $('#inuse').html('');
        }
    });
}
function password_prompt(fn) {
    $('#modalprompt').modal('show', function(){
        $('#verify_password').val('');
    });
    $('#cb2_prompt').off("click").on("click", function(){fn()});
}
function update_password() {
    if(loggedByEmail == 1) {
        var password = 0;
    } else {
        var password = $('#verify_password').val();
    }
    var query = {
        action: 'profile-password',
        password: password,
        new_password: $('#new_password').val(),
        new_password_again: $('#new_password_again').val(),
        reCaptchaToken: $('#reCaptchaToken').val()
    };
    callAPI_GET(query, function(data) {
        refresh_recaptcha();
        $('#verify_password').val('');
        $('#new_password').val('');
        $('#new_password_again').val('');
        $('#nomatch').html('');
        $('#match').html('');
        $('#modalprompt').modal('hide');
        $('#submit_new_password').hide();
        if(data.success) {
            errormodal(data.success, 'OK', function(){
                if(loggedByEmail == 1) {
                    refresh_page();
                }
            });
        } else {
            errormodal(data.errors);
        }
    });
}
function update_email() {
    var query = {
        action: 'profile-email-request',
        password: $('#verify_password').val(),
        email: $('#email').val(),
        reCaptchaToken: $('#reCaptchaToken').val()
    };
    callAPI_GET(query, function(data) {
        refresh_recaptcha();
        $('#verify_password').val('');
        $('#modalprompt').modal('hide');
        if(data.success) {
            errormodal(data.success, 'OK');
            $('#change-email').show();
        } else {
            errormodal(data.errors);
        }
    });
}
function update_email_finish() {
    if(cancel_email_change == 1) {
        var code = 'cancel';
    } else {
        var code = $('#newemail-code').val();
    }
    var query = {
        action: 'profile-email-finish',
        password: $('#verify_password').val(),
        code: code,
        reCaptchaToken: $('#reCaptchaToken').val()
    };
    callAPI_GET(query, function(data) {
        refresh_recaptcha();
        $('#newemail-code').val('');
        $('#verify_password').val('');
        $('#modalprompt').modal('hide');
        if(!data.errors) {
            if(data.success.id == 2) {
                $('#change-email').hide();
                errormodal(data.success, 'OK', refresh_page);
            }
            if(data.success.id == 1) {
                gotoURL(htaccess.login, 'nc', '/'+data.success.str);
            }
        }
        if(data.errors) {
            errormodal(data.errors);
        }
    });
}
function update_address() {
    var query = {
        action: 'profile-address',
        password: $('#verify_password').val(),
        name:$('#address-name').val(),
        street:$('#address-street').val(),
        city:$('#address-city').val(),
        zip:$('#address-zip').val(),
        reCaptchaToken: $('#reCaptchaToken').val()
    };
    callAPI_GET(query, function(data) {
        refresh_recaptcha();
        $('#modalprompt').modal('hide');
        $('#verify_password').val('');
        if(data.success != 0) {
            $('#address-name').val(data.new_address.name);
            $('#address-street').val(data.new_address.street);
            $('#address-city').val(data.new_address.city);
            $('#address-zip').val(data.new_address.zip);
            errormodal(data.success, 'OK');
            $('#submit_new_address').hide();
        } else {
            errormodal(data.errors);
        }
    });
}
function disable_tfa() {
    $('#modalprompt').modal('hide');
    var query = {
        password: $('#verify_password').val(),
        action: 'tfa-disable'
    };
    callAPI_GET(query, function(data) {
        if(data.success) {
            errormodal(data.success, 'ok', refresh_page);
        } else {
            errormodal(data.errors);
        }
    });
}
function logout_everywhere() {
    var query = {
        action: 'logout-everywhere'
    };
    callAPI_GET(query, function(data) {
        if(data.success) {
            errormodal(data.success, 'ok', refresh_page);
        } else {
            errormodal(data.errors);
        }
    });
}