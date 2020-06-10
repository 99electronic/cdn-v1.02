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
        action: 'licence'
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if(data.success) {
            $('#licence-date').html(data.last_licence_update);
            $('#licence').html(data.licence);
        }
        page_loading('done');
    });
}