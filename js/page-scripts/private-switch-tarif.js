$(document).ready(function() {
    page_loading(
        'start',
        'fa-angle-left',
        'zpět',
        function () {
            gotoURL(htaccess.client, 'nc', '/'+$('#keyword').val());
        });
});
function refresh_page() {
    var query = {
        action: 'tarif-switch-options',
        keyword: $('#keyword').val()
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if(data.loginStatus == 'in') {
            if(data.success) {
                fillData(data);
            } else {
                gotoURL(htaccess.invalid, 'st');
            }
        } else {
            gotoLoginPage();
        }
        page_loading('done');
    });
}
function fillData(data) {
    $('.service-name').html(data.tarif_data.nickname);
    $('#title').html('Změna tarifu č.'+data.keyword+' ['+data.tarif_data.nickname+']');
    $('.keyword').html(data.keyword);
    $('#sms-limit').html(data.tarif_data.sms.limit + ' '+data.tarif_data.sms.str);
    $('#mms-limit').html(data.tarif_data.mms.str);
    $('#sms-lenght').html(data.tarif_data.smslen);
    $('#ddays').html(data.tarif_data.ddays.label + ' ' + data.tarif_data.ddays.result.long);
    $('#service-senders').html(data.tarif_data.senders);
    $('#service-price').html(data.tarif_data.price[1]);
    var options = data.tarifs;
    $('#new-tarif').children().remove().end()
        .append('<option selected value="0">-- vyberte nový tarif z nabídky --</option>');
    $.each(options, function(key) {
        $('#new-tarif').append('<option value="'+options[key].id+'">'+
        options[key].name+' '+options[key].price[1]+'</option>');
    });
    $('#new-tarif').on("change", function() {
        load_new_tarif();
    });
    $('.back-link').on("click", function() {
        gotoURL(htaccess.tarif_details, 'nc', '/'+data.keyword)
    });
}
function load_new_tarif() {
    var query = {
        action: 'tarif-switch-new',
        id: $('#new-tarif').val(),
        keyword: $('#keyword').val()
    };
    callAPI_GET(query, function(data) {
        if(data.success) {
            $("#new-tarif option[value='0']").remove();
            $('#new-tarif-container').show();
            $('#new-service-name').html(data.newtarif.nickname);
            $('#new-sms-limit').html(data.newtarif.sms.limit + ' '+data.newtarif.sms.str);
            $('#new-mms-limit').html(data.newtarif.mms.str);
            $('#new-sms-lenght').html(data.newtarif.sms.smslen);
            $('#new-ddays').html(data.newtarif.ddays.label + ' ' + data.newtarif.ddays.result.long);
            $('#new-service-senders').html(data.newtarif.senders);
            $('#new-service-price').html(data.newtarif.price[1]);
            if(data.finalization.active == 0) {
                var warning = 'Potvrzením formuláře bude váš tarif změněn na: '
                    + $('#new-tarif  option:selected').text();
            }
            if(data.finalization.active == 1) {
                if(data.finalization.daysleft.difference.cnt > 0) {
                    var daychange = 'se počet zbývajících dnů tarifu prodlouží o '
                        + data.finalization.daysleft.difference.cnt
                        + ' ' + data.finalization.daysleft.difference.str
                        + ' na celkových ' + data.finalization.daysleft.new.cnt
                        + ' ' + data.finalization.daysleft.new.str;
                }
                if(data.finalization.daysleft.difference.cnt < 0) {
                    var daychange = 'se počet zbývajících dnů tarifu zkrátí o '
                        + (data.finalization.daysleft.difference.cnt*-1)
                        + ' ' + data.finalization.daysleft.difference.str
                        + ' na celkových ' + data.finalization.daysleft.new.cnt
                        + ' ' + data.finalization.daysleft.new.str;
                }
                if(data.finalization.daysleft.difference == 0) {
                    var daychange = 'se počet zbývajících dnů tarifu nezmění';
                } else {
                    var newdate = 'Den platnosti tarifu se změní z '
                        + data.finalization.dates.old.str + ' na '
                        + data.finalization.dates.new.str;
                }
                var warning = 'Potvrzením formuláře ' + daychange + '<br>' + newdate;
            }
            $('#finalization-buttons').show();
            $('#finalization-info').html(warning);
            $('#token').val(data.finalization.token);
            $('#submit').on("click", function(){
                submit_switch();
            });
            $('#cancel').on("click", function(){
                cancel_switch();
            });
        } else {
            gotoURL(htaccess.invalid, 'st');
        }
    });
}
function submit_switch() {
    var query = {
        action: 'tarif-switch-submit',
        id: $('#new-tarif').val(),
        keyword: $('#keyword').val(),
        token: $('#token').val()
    };
    callAPI_GET(query, function(data) {
        if(data.success) {
            errormodal(data.success, 'OK', cancel_switch);
        } else {
            errormodal(data.errors);
        }
    });
}
function cancel_switch() {
    gotoURL(htaccess.client, 'nc', '/'+$('#keyword').val());
}