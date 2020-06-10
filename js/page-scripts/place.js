$(document).ready(function() {
    page_loading(
        'start',
        'fa-angle-left',
        'zpět',
        function () {
            history.back();
        });
    refresh_page();
});
function refresh_page() {
    var query = {
        action: 'place',
        id: $('#id').val()
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if($('#keyword').val()) {
            $('#referal-back').html('zpět');
        } else {
            $('#referal-back').html('na seznam českých věznic');
        }
        if(data.success) {
            var header_img = cdn_server+'img/places/large/'+data.id+'.jpg';
            $('.nickname').html(data.nickname);
            $('#header-img-div').css('background-image', 'url('+header_img+')');
            $('#header-map').css('background-image', 'url('+cdn_server+'img/misc/blind-map-cz.png)');
            $('#map-marker')
                .css('background-image', 'url('+cdn_server+'img/misc/map-marker.png)')
                .css('top', (data.map.marker.top-2)+'%')
                .css('left', data.map.marker.left+'%');
            $('#header-img').attr('src', header_img);
            $('#google-map').attr('src', data.map.google_map);
            $('#office-address').attr('src', data.map.google_url).html(data.address.office.address);
            $('#postal-address').html(data.address.postal.street+' '+data.address.postal.number+',<br>' +
            data.address.postal.city+' '+data.address.postal.zip);
            $('#place-site').attr('href', data.sources.url).html(data.sources.website);
            $('#place-description').html(data.description);
            $('#source-name').attr('href', 'https://'+data.sources.name).html(data.sources.name);
        } else {
            errormodal(data.errors);
        }
        $('#back-link').on("click", function(){
            gotoURL(htaccess.home);
        });
        page_loading('done');
    });
}