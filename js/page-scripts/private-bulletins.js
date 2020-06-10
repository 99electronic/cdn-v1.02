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
    var bulletins = '';
    var query = {
        action: 'bulletin-list'
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if(data.success) {
            if(data.list) {
                $.each(data.list, function(key, bulletin) {
                    bulletins += create_bulletin_item(bulletin);
                    $('#bulletins').on("click", '#bulletin_link_' + bulletin.id, function () {
                        gotoURL(htaccess.bulletin, 'nc', '/' + bulletin.id);
                    });
                });
                $('#bulletins').html('<div style="list-style-type: none;">'+bulletins+'</div>');
            } else {
                $('#bulletins').html('Nemáte žádné zprávy');
            }
        } else {
            errormodal(data.errors);
        }
        page_loading('done');
    });
}
function create_bulletin_item(bulletin) {
    if(bulletin.read) {
        var envelope = 'envelope3';
        var color = 'text-gray';
    } else {
        var envelope = 'mail';
        var color = 'text-default';
    }
    if(bulletin.important) {
        bulletin.important = '<span class="fa fa-danger text-danger"></span>&nbsp;';
    } else {
        bulletin.important = '';
    }
    return '<div id="bulletin_'+bulletin.id+'" ' +
    'class="'+color+'" style="margin-bottom:20px;">' +
    '<span class="fa fa-'+envelope+'" style="margin-left: 14px;"></span> '+bulletin.date.str+' - ' +
    '<span id="bulletin_link_'+bulletin.id+'" class="text-link">'+bulletin.important+bulletin.subject+'</span><hr></div>';
}
