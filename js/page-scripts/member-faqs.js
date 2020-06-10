$(document).ready(function() {
    refresh_page();
});
function refresh_page() {
    var query = {
        action: 'faq-list'
    };
    callAPI_GET(query, function(data) {
        if(data.success) {
            $('#loaded-container').show();
            $('#loader').hide();


        } else {
            errormodal(data.errors);
        }
    });
}