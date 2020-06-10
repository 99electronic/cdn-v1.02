$(document).ready(function() {
    page_loading(
        'start',
        'fa-angle-left',
        'na hlavní stránku',
        function() {
            gotoURL(htaccess.home);
        });
});
function refresh_page() {
    var query = {
        action: 'place-list'
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if(data.success) {
            var list = '';
            $.each(data.places, function(key, value){
                list += create_places_item(value);
                $('#places_container').on("click", '#place_'+value.id, function(){
                    open_place(value.id);
                });
            });
            $('#places_container').html(list);
        } else {
            errormodal(data.errors);
        }
        $('#back-link').on("click", function(){
            gotoURL(htaccess.home);
        });
        page_loading('done');
    });
}
function create_places_item(place) {
    return '<div id="place_'+place.id+'" class="row">' +
        '<div class="pull-left"><img src="'+cdn_server+'img/places/small/'+place.id+'.jpg" ' +
        'class="cursorHand" style="margin-top:0px;border-radius: var(--border-radius-image);"></div>' +
        '<div style="margin-left:15px;" class="pull-left"><strong>'+place.nickname+'</strong><br>' +
        '<span class="fa fa-map-marker"></span> ' +
        place.address.street + ' ' + place.address.number +', <br class="mobileOnly">'+
        place.address.city + ' ' + place.address.zip + '</div>' +
        '</div><hr>';
}
function open_place(id) {
    gotoURL(htaccess.place, 'st', '/'+id);
}
