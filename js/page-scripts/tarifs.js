var tarifs = null;
var loginStatus = null;
$(document).ready(function() {
    page_loading(
        'start',
        'fa-angle-left',
        'zpět',
        function () {
            history.back();
        });
});
function refresh_page() {
    keyword = $('#keyword').val();
    $('#container1').hide();
    $('#container2').hide();
    var query = {
        action: 'tarif-list',
        existing: 1
    };
    callAPI_GET(query, function(data) {
        loginStatus = data.loginStatus;
        if(loginStatus == 'in') {
            construct_main_menu(data.loginStatus, data.bulletins);
            if(!data.clients[0]) {
                data.existing = 0;
            }
        } else {
            construct_main_menu(data.loginStatus);
            data.existing = 0;
        }
        if(data.success) {
            tarifs = data.list;
            fillData(data);
        } else {
            gotoURL(htaccess.invalid_link, 'st');
        }
    });
}
function fillData(data) {
    if(data.existing==1) {
        var list = '';
        var clients = data.clients;
        $.each(clients, function(key, client) {
            list += '<div class="text-link" id="existing-contact-'+key+'"><span class="fa fa-user"></span> ' +
                client.first_name + ' ' +
                client.last_name + ' - č.' + client.keyword + '</div>';
            $('#container1').on("click", '#existing-contact-'+key, function(){
                gotoURL(htaccess.client, 'nc', '/'+client.keyword);
            })
        });
        $('#container1').html('Pro změnu služby za dražší/levnější nebo pro provedení platby u existujícího kontaktu ' +
            'pokračujte kliknutím na kontakt, který chcete upravit.' +
            list + '<hr>Pokud si přejete objednat novou službu pro nového klienta který není mezi výše uvedenými kontakty' +
            '<br><span class="text-link" id="newservice">pokračujte vytvořením nového kontaktu zde</span>');
        $('#container1').show();
        $('#container2').hide();
        $('#newservice').on("click", function(){
            newservice('regular');
            newservice('promotion');
        });
    }
    if(data.existing==0) {
        newservice('regular');
        newservice('promotion');
    }
    page_loading('done');
}
function newservice(type) {
    $('#container1').hide();
    $('#container2').show();
    var list = '';
    var s = '';
    var s2 = '';
    if(tarifs[type]) {
        $.each(tarifs[type], function (key, val) {
            if (val.senders.ctn > 1) {
                s = '1 až ';
            } else {
                s = '';
            }
            if (val.monthslimit.ctn > 1) {
                s2 = ' Min. 1 měsíc, ';
            } else {
                s2 = '';
            }
            list += '<div>' +
                '<strong>' + val.name + '</strong><br>' +
                '<ul class="tarif-checklist">' +
                '<li><span class="fa fa-check " style="color: gray;"></span> Až ' + (val.sms.ctn) * 30 + ' zpráv každý měsíc!</li>' +
                '<li><span class="fa fa-check " style="color: gray;"></span> ' + s + val.senders.ctn + ' ' + val.senders.str + '</li>' +
                '<li><span class="fa fa-check " style="color: gray;"></span> ' + val.price[1] + '/měs.</li>' +
                '<li><span class="fa fa-check " style="color: gray;"></span> ' + s2 + 'maximálně ' + val.monthslimit.ctn + ' ' + val.monthslimit.str + '</li>' +
                '<li><span class="fa fa-check " style="color: gray;"></span> ' + val.sms.ctn + ' ' + val.sms.str + ' každý den</li>' +
                '<li><span class="fa fa-check " style="color: gray;"></span> ' + val.mms.ctn + ' ' + val.mms.str + ' na dopis</li>' +
                '<li><span class="fa fa-check " style="color: gray;"></span> Doručováno: ' + val.ddays.label + ' ' + val.ddays.result.auto + '</li>' +
                '<li><span class="text-link pop_info_link" id="pop_info_' + val.id.id + '">Více informací  <span class="fa fa-angle-right"></span></span>' +
                '<div id="info_' + val.id.id + '" class="tarif-detail-info">' +
                val.description + '</div>' +
                '</li>' +
                '<li>' +
                '<button class="btn btn-default" id="buy_' + val.id.id + '" style="margin-top:8px;">' +
                '<span class="fa fa-cart"></span> Nezávazně Objednat</button>' +
                '</li>' +
                '</ul>' +
                '<hr>' +
                '</div>';
            $('#list-' + type).on("click", '#buy_' + val.id.id, function () {
                buy(val.id.id, val.id.hash);
            });
            $('#list-' + type).on("click", '#pop_info_' + val.id.id, function () {
                $('.tarif-detail-info').hide();
                $('.pop_info_link').show();
                $('#pop_info_' + val.id.id).hide();
                $('#info_' + val.id.id).show();
            });
        });
    }
    $('#list-'+type).html(list);
    $('.tarif-detail-info').hide();
    $('.tarif-detail-info').on("click", function(){
        $('.tarif-detail-info').hide();
        $('.pop_info_link').show();
    });
    if(!list) {
        if(type == 'regular') {
            $('#list-regular').html(' - žádné tarify nejsou k dispozici');
        }
        if(type == 'promotion') {
            $('#no-promo-message').html(' - žádné akce nejsou k dispozici');
        }
    }
}
function buy(id,token) {
    if(loginStatus == 'out') {
        $('#modalprompt').modal('show');
        $('#cb1_prompt').on("click", function(){
            gotoURL(htaccess.login);
        });
        $('#cb2_prompt').on("click", function(){
            gotoURL(htaccess.register);
        });
    }
    if(loginStatus == 'in') {
        gotoURL(htaccess.new_service, 'nc', '/'+id+'/'+token);
    }
}