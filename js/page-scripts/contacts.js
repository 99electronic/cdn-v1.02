$(document).ready(function() {
    page_loading(
        'start',
        'fa-angle-left',
        'zpět',
        function () {
            history.back();
        }
    )
});
function refresh_page() {
    var query = {
        action: 'contacts'
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if(data.success) {
            $('#admin_email').html(data.contacts.admin_email)
            .attr('href', 'mailto:'+data.contacts.admin_email);
            $('#business_email').html(data.contacts.business_email)
            .attr('href', 'mailto:'+data.contacts.business_email);
            $('#address').html(data.contacts.name+
                '<br>'+data.contacts.street+' '+data.contacts.streetNum+
                '<br>'+data.contacts.city+' '+data.contacts.zip);
            $('#phone').html(data.contacts.phone);
            $('#ic').html(data.contacts.ic);
            $('#ic2').html(data.contacts.ic2);
            $('#legalInfo').html(data.contacts.legalInfo);
        } else {
            errormodal(data.errors);
        }
        page_loading('done');
    });
}