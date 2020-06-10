var keyword = null;
var service = null;
$(document).ready(function() {
    page_loading(
        'start',
        'fa-angle-left',
        'zpět',
        function(){
        gotoURL(htaccess.client+'/'+keyword);
    });
});
function refresh_page() {
    var query = {
        action: 'client',
        keyword: $('#keyword').val()
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if(data.loginStatus == 'in') {
            if(!data.service.parent.im_parent) {
                gotoURL(htaccess.invalid_link, 'st');
            } else {
                fillData(data);
                page_loading('done');
            }
        } else {
            gotoLoginPage();
        }
    });
}
function fillData(data) {
    contacts = data.service.contacts;
    var messages = contacts.messages;
    service = data.service.data;
    place = data.service.place;
    var tarif = data.service.tarif;
    var last_print = data.service.last_print;
    keyword = data.service.keyword;
    release_date = service.release_date.date;
    $('.keyword').html(keyword);
    $('.service-name').html(tarif.nickname);
    $('#title').html('Tarif č.'+keyword+' ['+tarif.nickname+'] '+service.first_name+' '+service.last_name);
    $('#ddays').html(tarif.ddays.label + ' ' + tarif.ddays.result.long);
    $('#tarif-end-label1,#tarif-end-info-date_str').removeClass();
    $('#tarif-end-label1,#tarif-end-info-date_str').addClass('text-default');
    if(tarif.end.state == 0) {
        $('#tarif-end-label1').html('Neaktivováno');
    }
    if(tarif.end.state == 1 || tarif.end.state == 2) {
    $('#tarif-end-label1').html(tarif.end.label1);
    $('#tarif-end-info-date_str').html(tarif.end.date.str.full);
    if(tarif.end.state == 1) {
        $('#tarif-end-info-result').html(' (' + tarif.end.label2 + ' ' + tarif.end.result + ')');
        }
    $('#mms-limit-label').show();
    }
    if(tarif.end.state == 3) {
        payment_link = 'Zaplatit - znovu aktivovat';
        $('#tarif-end-label1,#tarif-end-info-date_str').removeClass();
        $('#tarif-end-label1,#tarif-end-info-date_str').addClass('text-danger');
        $('#tarif-end-label1').html(tarif.end.label1);
        $('#tarif-end-info-date_str').html(tarif.end.date.str.full);
    }
    $('#sms-limit').html(tarif.sms.ctn+' '+tarif.sms.str);
    $('#mms-limit').html(messages.mms.limit+' '+messages.mms.string.limit);
    $('#sms-lenght').html(tarif.sms.len);
    if(last_print.details.id) {
        $('#prints').html(' celkem odesláno ' + last_print.details.index);
        $('#prints-link').show();
        $('#prints-link').on("click", function(){
            gotoURL(htaccess.prints, 'nc', '/1/'+keyword);
        });
    } else {
        $('#prints-link').hide()
        $('#prints').html(service.first_name+' '+service.last_name+' čeká na svůj první dopis');
    }
    $('#tarif-end-label1,#tarif-end-info-date_lang').removeClass();
    $('#tarif-end-label1,#tarif-end-info-date_lang').addClass('text-default');
    if(tarif.end.state == 0) {
        $('#tarif-end-label1').html('Neaktivováno');
    }
    if(tarif.end.state == 1 || tarif.end.state == 2) {
        $('#tarif-end-label1').html(tarif.end.label1);
        $('#tarif-end-info-date_lang').html(tarif.end.date.str.full);
        if(tarif.end.state == 1) {
            $('#tarif-end-info-result').html(' (' + tarif.end.label2 + ' ' + tarif.end.result + ')');
        }
    }
    if(tarif.end.state == 3) {
        payment_link = 'Zaplatit - znovu aktivovat';
        $('#tarif-end-label1,#tarif-end-info-date_lang').removeClass();
        $('#tarif-end-label1,#tarif-end-info-date_lang').addClass('text-danger');
        $('#tarif-end-label1').html(tarif.end.label1);
        $('#tarif-end-info-date_lang').html(tarif.end.date.str.full);
    }
    $('#service-senders').html(contacts.list_length + ' (aktivní: '+contacts.sharing.total+')');
    $('#service-price').html(tarif.cost.price_label+' měsíčně');
    $('#switch-tarif').on("click", function() {
        gotoURL(htaccess.change_tarif, 'nc', '/'+keyword);
    });
}