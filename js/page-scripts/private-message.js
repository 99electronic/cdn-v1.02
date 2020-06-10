var keyword = null;
var parent = null;
var token = null;
$(document).ready(function() {
    page_loading(
        'start',
        'fa-angle-left',
        'zpět',
        back_button
    );
    setInterval(messageCountchar, 300);
});
function refresh_page() {
    var query = {
        action: 'client',
        keyword: $('#keyword').val()
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if(data.loginStatus == 'in') {
            if(data.errors_count > 0) {
                gotoURL(htaccess.invalid_link, 'st');
            } else {
                fillData(data);
            }
        } else {
            gotoLoginPage();
        }
        page_loading('done');
    });
}
function fillData(data) {
    var contact = data.service.contacts.list[data.service.contacts.me];
    if(contact == undefined) {
        gotoURL(htaccess.invalid_link, 'st');
    }
    var messages = data.service.contacts.messages;
    var service = data.service.data;
    var place = data.service.place;
    var tarif = data.service.tarif;
    var next_print = data.service.next_print;
    var last_print = data.service.last_print;
    keyword = data.service.keyword;
    parent = data.service.parent;
    token = data.service.token;
    $('.keyword').html(keyword);
    $('.client-name').html(service.first_name + ' ' + service.last_name);
    $('.dob').html(+service.dob);
    $('.avatar-src').attr('src', service.avatar.data);
    $('.place-name').html(place.name);
    $('.place-nickname').html(place.nickname);
    $('#contact-name').html(contact.name);
    $('#contact-email').html(contact.email);
    $('#ddays').html(tarif.ddays.label + ' ' + tarif.ddays.result.auto);
    $('#mms-limit-label').hide();
    $('#tarif-end-label1,#tarif-end-info-date_str').removeClass();
    $('#tarif-end-label1,#tarif-end-info-date_str').addClass('text-default');
    if(contact.ban == 1) {
        $('#banned-contact').html('<span class="fa fa-warning"></span> <strong>Tento kontakt je zablokován správcem</strong>').show();
        $('#message-form').hide();
    } else {
        $('#banned-contact').html('').hide();
        $('#message-form').show();
    }
    if(tarif.end.state == 0) {
        $('#tarif-end-label1').html('Neaktivováno');
    }
    if(tarif.end.state == 1 || tarif.end.state == 2) {
        $('#tarif-end-label1').html(tarif.end.label1);
        $('#tarif-end-info-date_str').html(tarif.end.date.str.short);
        if(tarif.end.state == 1) {
            $('#tarif-end-info-result').html(' (' + tarif.end.label2 + ' ' + tarif.end.result + ')');
        }
        $('#mms-limit-label').show();
    }
    if(tarif.end.state == 3) {
        $('#tarif-end-label1,#tarif-end-info-date_str').removeClass();
        $('#tarif-end-label1,#tarif-end-info-date_str').addClass('text-danger');
        $('#tarif-end-label1').html(tarif.end.label1);
        $('#tarif-end-info-date_str').html(tarif.end.date_str);
    }
    $('#charCount_limit').val(tarif.sms.len);
    if(tarif.end.state == 1) {
        $('#prints-nexterm').html(next_print.print.str);
        $('#prints-next_delivery').html(
            '<br><strong>Bude doručeno: </strong> '+next_print.delivery.str
        );
    } else {
        $('#prints-nexterm').html('(není v plánu)');
    }
    $('.place-link').on("click", function(){
        gotoURL(htaccess.place, 'st', '/'+place.id);
    });
    if(last_print.details.index > 0) {
        $('#prints-last').show();
        $('#prints-last-index').html(last_print.details.index);
        $('#prints-last-expedited').html(last_print.print.str);
        if(last_print.delivered) {
            $('#prints-last-delivered').show();
            $('#prints-last-delivered-str').html(last_print.delivery.str);
        } else {
            $('#prints-last-delivered').hide();
            $('#prints-last-delivered-str').html('');
        }
    } else {
        $('#prints-last').hide();
    }
    if(messages.mms.left) {
        $('.mms-left').html(messages.mms.left);
        $('.mms-link-active').show();
        $('.mms-link-inactive').hide();
    } else {
        $('.mms_limit').html(messages.mms.limit);
        $('.mms-link-inactive').show();
        $('.mms-link-active').hide();
    }
    if(messages.sms.left==0) {
        $('.messages-sms-left').html('nezbývá žádná');
        $('#messageSource').prop('disabled', true);
        $('#sms_button_container').hide();
    } else {
        $('.messages-sms-left').html(messages.sms.left);
        $('#messageSource').prop('disabled', false);
        $('#sms_button_container').show();
        $('#sms_button').on("click", function(){
            submit_sms();
        });
    }
    if(parent.im_parent) {
        $('#service-link').on("click", function(){
            gotoURL(htaccess.client, 'nc', '/'+keyword);
        });
        $('#hide_contact_container').hide();
    } else {
        $('#parent-im_parent').html('Správcem účtu je: <a href=\"mailto:' + parent.parentemail_eml.email +
        '\">' + parent.parentemail_eml.email);
        $('#hide_contact_container').show();
    }
    $('#clear-message').on("click",function(){
        refresh_page();
    });
    toggle_switch(0, contact.appsettings.hide);
    $('#switch0').on("click", function() {
        toggle_hide();
    });
    $('#messageSource').css('height', 192).val('');
    messageCountchar();
}
function back_button(){
    if(parent.im_parent == 1) {
        gotoURL(htaccess.client, 'nc', '/' + keyword);
    } else {
        gotoURL(htaccess.home, 'nc');
    }
}
function toggle_switch(i, state) {
    if(state == 0) {
        $('#hidden-info').hide();
        $('#switch'+i).removeClass('fa-toggle-on text-danger').addClass('fa-toggle-off');
    } else {
        $('#hidden-info').show();
        $('#switch'+i).removeClass('fa-toggle-off').addClass('fa-toggle-on text-danger');
    }
}
function toggle_hide() {
    var query = {
        action: 'contact-hide',
        keyword: $('#keyword').val()
    };
    callAPI_GET(query, function(data) {
        if(data.loginStatus == 'in') {
            if(data.success) {
                toggle_switch(0, data.hide_state);
            } else {
                gotoURL(htaccess.invalid_link, 'st');
            }
        } else {
            gotoLoginPage();
        }
    });
}
function submit_sms() {
    var post_data = {
        keyword: keyword,
        token: token,
        message: b64EncodeUnicode($('#messageSource').val())
    };
    callAPI_POST(
        'sms-submit',
        post_data,
        function(data) {
            if (data.success) {
                errormodal(data.success, 'OK', refresh_page);
            } else {
                errormodal(data.errors);
            }
        });
}

function upload_mms(mms) {
    var annotation = $("#mms_note").val();
    var post_data = {
        keyword: keyword,
        token: token,
        image: mms,
        message: b64EncodeUnicode(annotation)
    };
    callAPI_POST(
        'mms-submit',
        post_data,
        function(data) {
            if (data.success) {
                if(data.mms.left == 0) {
                    $('.mms-link-active').hide();
                    $('.mms-link-inactive').show();
                    $('.mms_limit').html(data.mms.limit);
                }
                errormodal(data.success, 'OK');
                $('.mms-left').html(data.mms.left);
            } else {
                errormodal(data.errors);
                }
        });
}