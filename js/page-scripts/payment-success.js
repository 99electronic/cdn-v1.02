$(document).ready(function() {
    page_loading(
        'start',
        'fa-angle-left',
        'na hlavní stránku',
        function () {
            gotoURL(htaccess.home);
        }
    );
    if($('#app').val() == 1) {

    }
});
function refresh_page() {
    $('#paid-to-cancelled').hide();
    var query = {
        action: 'payment-success',
        state: $('#state').val(),
        newstate: $('#newstate').val(),
        keyword: $('#keyword').val()
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if(data.loginStatus == 'in') {
            if(data.success) {
                if($('#newstate').val() == 4) {
                   $('#paid-to-cancelled').show();
                   $('#new-ticket').attr('href', htaccess.new_ticket);
                }
                if($('#newstate').val() == 2) {
                    $('#payment-result-message').html(data.payment.result+' (zrušeno)');
                    $('#payment-result-message').addClass('text-danger');
                }
                if($('#newstate').val() != 4 && $('#newstate').val() != 2) {
                    $('#payment-result-message').html(data.payment.result);
                    $('#payment-result-message').addClass('text-'+data.payment.color);
                }
                $('#header-title-text').html(data.payment.state);
                $('#tarif-keyword').html(data.keyword);
                $('#tarif-page').on("click", function(){
                    gotoURL(htaccess.client, 'nc', '/'+data.keyword);
                });
            } else {
                errormodal(data.errors);
            }
        } else {
            gotoLoginPage();
        }
    });
    page_loading('done');
}