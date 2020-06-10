var keyword = null;
$(document).ready(function() {
    page_loading(
        'start',
        'fa-angle-left',
        'zpět',
        function() {
        if(keyword) {
            gotoURL(htaccess.client, 'nc', '/'+keyword);
        } else {
            gotoURL(htaccess.home);
        }
    });
});
function refresh_page() {
    keyword = $('#keyword').val();
    var query = {
        action: 'payment-list',
        page: $('#page').val(),
        keyword: keyword
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if(data.loginStatus == 'in') {
            if(data.success) {
                fillData(data);
            } else {
                errormodal(data.errors);
            }
        } else {
            gotoLoginPage();
        }
        page_loading('done');
    });
}
function fillData(data) {
    $('#loaded-container').show();
    $('#loader').hide();
    if(keyword) {
        $('#back-link').html('na tarif');
        $('#keyword-filter').html('Platby pro klienta č.'+keyword+': '+
            data.filter.first_name+' '+data.filter.last_name+
            ' <span class="clear-filter text-danger cursorHand" style="font-weight: normal;">'
            +'<span class="fa fa-cancel"></span> zobrazit všechny platby</span>');
    } else {
        $('#keyword-filter').html('');
    }
    $('.clear-filter').on("click", function() {
        gotoURL(htaccess.payments, 'nc', '/');
    });
    if(data.payments) {
        payment_list(data.payments);
        $('.paging').html(paging_element(data.paging,gopage));
    } else {
        $('.paging').html('V historii nemáte žádné platby');
    }
}
function gopage(page) {
    gotoURL(htaccess.payments, null, '/'+page+'/'+keyword);
}
function payment_list(payments) {
    var list = '';
    $.each(payments, function(key, value) {
        list += create_payment_list_item(value);
        $('#payment-list').on("click", '#payment-'+value.ordernumber, function(){
            gotoURL(htaccess.receipt, 'nc', '/'+value.ordernumber+'/'+value.token, 1);
        });
        $('#payment-list').on("click", '#cancel-'+value.ordernumber, function(){
            cancel_payment('check', value.ordernumber);
        });
        $('#payment-list').on("click", '#payment-'+value.ordernumber+'-'+value.keyword, function(){
            gotoURL(htaccess.client, 'nc', '/'+value.keyword);
        });
    });
    $('#payment-list').html(list);
}
function create_payment_list_item(value) {
    if(value.state.state == 0) {
        var cancel_payment = ' <span class="text-danger cursorHand" ' +
            'id="cancel-'+value.ordernumber+'">[zrušit platbu]</span> ';
    } else {
        var cancel_payment = '';
    }

    var state = '<span class="text-'+value.state.str[1]+'"> - '+value.state.str[2]+'</span>';
    return '<span>ID č.<span class="text-'
        +value.state.str[1]+'">'+value.ordernumber+'</span> - objednáno dne: '
        +value.date[1]+' položka: '+value['productname']
        +'<br>Kód služby: <span id="payment-'+value.ordernumber+'-'+value.keyword+'" class="text-link">'+
        value.keyword+'</span> celkem: <strong>'+value.amount[1]
        +'</strong>'+state+cancel_payment+' | <span class="text-link" id="payment-'+value.ordernumber+'">' +
        '<span class="fa fa-print"></span> na tisk<span class="fa fa-angle-right"></span>'
        +'</span></span><hr>';
}
function cancel_payment(cancel_action, ordernumber) {
    var query = {
        action: 'payment-cancel',
        ordernumber: ordernumber,
        cancel_action: cancel_action
    };
    callAPI_GET(query, function(data) {
        if(data.success) {
            if(cancel_action == 'check') {
                $('#modalcancel_payment').modal('show');
                $('#modal_header_ordernumber,#modal_ordernumber').html(ordernumber);
                $('modal_email').html(data.loggedUser.email);
                $('#cb2_cancel_payment').on("click", function () {
                    cancel_payment('submit', ordernumber);
                });
            }
            if(cancel_action == 'submit') {
                errormodal(data.success, 'ok', refresh_page);
            }
        } else {
            errormodal(data.errors);
        }
    });
}