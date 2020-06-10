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
    $('#container1').hide();
    $('#container2').hide();
    var query = {
        action: 'tarif-list',
        tarif_compare_content: 1,
        existing: 0
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if(data.success) {
            fillData(data);
        } else {
            gotoURL(htaccess.invalid_link, 'st');
        }
        page_loading('done');
    });
}
function fillData(data) {
    create_table(data.list.regular, 'table-regular');
    if(data.list.promotion) {
        create_table(data.list.promotion, 'table-promotion');
    }
    if(data.list.promotion) {
        $('#promo').show();
    } else {
        $('#promo').hide();
    }
    $('#loader').hide();
    $('#loaded-container').show();
    $('#container2').show();
    $('#tarif_compare_content').html(data.tarif_compare_content.replace(/\n/g,"<br>"));
    $('#compare-pdf').attr('href', htaccess.compare_pdf);
}
function create_table(tariflist, table_id) {
    var id = new Array();
    var name = new Array();
    var ddays = new Array();
    var senders = new Array();
    var sms = new Array();
    var mms = new Array();
    var price = new Array();
    var monthslimit = new Array();
    var token = new Array();
    $.each(tariflist, function(key,value) {
        id.push(value.id);
        name.push(value.name);
        ddays.push(value.ddays);
        senders.push(value.senders);
        sms.push(value.sms);
        mms.push(value.mms);
        price.push(value.price);
        monthslimit.push(value.monthslimit);
        token.push(value.token);
    });
    var list = {name: name, ddays: ddays, senders: senders, sms: sms, mms: mms, price: price, monthslimit: monthslimit, id: id};
    var table = '';
    $.each(list, function(key, value) {
        table += create_row(value, key, table_id);
    });
    $('#'+table_id).html(table);
}
function create_row(data, row, table_id) {
    var r = '';
    var label ='';
    var tr = '<tr>';
    var i = 0;
    $.each(data, function(key, value) {
        if(row == 'name') {
            label = 'Název';
            r = value;
        }
        if(row == 'ddays') {
            label = 'Odesíláno';
            r = value.label+' '+value.result.shorter;
        }
        if(row == 'sms') {
            label = 'Zpráv/den';
            r = value.ctn;
        }
        if(row == 'mms') {
            label = 'Foto/dopis';
            r = value.ctn;
        }
        if(row == 'monthslimit') {
            label = 'Max. doba';
            r = value.ctn + ' ' + value.str;
        }
        if(row == 'price') {
            label = 'Cena';
            r = value[1];
        }
        if(row == 'id') {
            label = '<span class="fa fa-cart"></span>';
            r = '<span class="text-link" id="buy-'+value.id+'">Objednat</span>';
            $('#'+table_id).on("click", '#buy-'+value.id, function(){
                buy(value);
            });
        }
        if(r) {
            if(i == 0) {
                tr += '<td style="border:1px solid var(--border-color);padding:3px;text-align:center;width: 20%;">'+label+'</td>';
            }
            tr += '<td class="text-center" style="border:1px solid var(--border-color);padding:3px;">' + r + '</td>';
        }
        i++;
    });
    return tr += '</tr>';
}
function buy(value) {
    gotoURL(htaccess.new_service, 'nc', '/'+value.id+'/'+value.hash);
}