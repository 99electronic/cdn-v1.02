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
        action: 'support-download'
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if(data.success) {
            var list = '';
            $.each(data.screenshots, function(key, img){
                list += img;
            });
            $('#screenshots_container').html(list);
            $('#appstore-logo').attr('src', data.stores.ios.logo);
            $('#playstore-logo').attr('src', data.stores.apk.logo);
            $('#appstore-url').attr('href', data.stores.ios.url);
            $('#playstore-url').attr('href', data.stores.apk.url);
        } else {
            errormodal(data.errors);
        }
        page_loading('done');
    });
}