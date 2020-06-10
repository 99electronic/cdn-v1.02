$(document).ready(function() {
    refresh_page();
});
function refresh_page() {
    var query = {
        action: 'login-auth-token',
        uuid: $('#uuid').val(),
        auth_token: $('#auth_token').val()
    };
    callAPI_GET(query, function(data) {
        if(data.success) {
            redirect_to_payment();
        }
    });
}