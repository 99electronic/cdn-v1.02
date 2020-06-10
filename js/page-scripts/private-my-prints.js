var keyword = null;
$(document).ready(function() {
    page_loading(
        'start',
        'fa-angle-left',
        'zpět',
        function() {
        gotoURL(htaccess.mytarif, 'nc', '/'+keyword);
    });
});
function refresh_page() {
    keyword = $('#keyword').val();
    var query = {
        action: 'print-list',
        page: $('#page').val(),
        keyword: keyword
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if(data.loginStatus == 'in') {
            if(!data.success) {
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
    $('.back-link').on("click", function(){
        gotoURL(htaccess.client+'/'+keyword);
    });
    if(data.client) {
        $('#keyword-filter').html('Odeslané dopisy pro klienta č.'+keyword+': '+data.client.first_name+' '+data.client.last_name
            + ' ('+data.client.dob+')');
    } else {
        $('#keyword-filter').html('');
    }
    $('#back-button').on("click", function() {
        if(keyword) {
            gotoURL(htaccess.tarif_details, 'nc', '/'+keyword);
        } else {
            gotoURL(htaccess.home);
        }
    });
    if(data.prints) {
        prints_list(data.prints);
        $('.paging').html(paging_element(data.paging,gopage));
    } else {
        $('.paging').html('Žádné odeslané dopisy');
    }
}
function gopage(page) {
    gotoURL(htaccess.prints, null, '/'+page+'/'+keyword);
}
function prints_list(prints) {
    var list = '';
    $.each(prints, function(key) {
        list += create_print_list_item(prints[key]);
    });
    $('#print-list').html(list);
}
function create_print_list_item(value) {
    if(value.details) {
        value.details = ' ('+value.details+')';
    } else {
        value.details = '';
    }
    if(value.returned) {
        var returned = ' <span class="text-danger"> - Vráceno dne: '+value.returned.date.str+'!</span>';
    } else {
        var returned = '';
    }
    if(value.print.smsrange.sms.cnt > 0 && value.print.smsrange.mms.cnt > 0) {
        var content = value.print.smsrange.sms.cnt+' '+ value.print.smsrange.sms.str +
            ' a ' + value.print.smsrange.mms.cnt+' '+ value.print.smsrange.mms.str
    }
   if(value.print.smsrange.sms.cnt > 0 && value.print.smsrange.mms.cnt == 0) {
        var content = value.print.smsrange.sms.cnt+' '+ value.print.smsrange.sms.str;
    }
    if(value.print.smsrange.sms.cnt == 0 && value.print.smsrange.mms.cnt > 0) {
        var content = value.print.smsrange.mms.cnt+' '+ value.print.smsrange.mms.str
    }
    return '<span>Dopis č.<span class="text-' +
        value.id+' cursorHand">'+value.print.index+'</span>'+returned+'<br>' +
        ' '+value.place+'<br>' +
        value.street + ' ' + value.housenumber + value.details + '<br>' +
        value.city + ' ' + value.zip+'</span>' +
        '<br>Obsahuje '+ content +
        ' od ' + value.print.smsrange.from.str + ' do ' + value.print.smsrange.to.str +
        ' ('+value.print.pages.cnt+' '+value.print.pages.str+'/'
        + value.print.sheets.cnt +' '+value.print.sheets.str+')' +
        '<hr>';
}