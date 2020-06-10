var session_show_hides = 0;
$(document).ready(function() {
    page_loading(
        'start'
    );
});
function refresh_page() {
    var query = {
        action: 'mylist'
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if(!data.show_hides) {
            data.show_hides = 0;
        }
        session_show_hides = data.show_hides;
        if(data.loginStatus == 'in') {
            if(data.list) {
                clients(data.list);
            } else {
                if(!data.list) {
                    $('#my_contacts').html('Nemáte žádné kontakty. Abyste mohli tuto službu využívat, ' +
                        'je potřeba vytvořit nový kontakt (<span class="new_contact text-link">kliknutím zde ' +
                        '</span> nebo vpravo dole pod tímto textem), ' +
                        'nebo vaši emailovou adresu '+data.loggedUser.email+' někdo jiný, kdo už službu využívá a chce abyste mohli psát ' +
                        'sms do vězení stejnému adresátovi, vás jako kontakt k službě přidá - v takovém případě za službu nic neplatíte.')
                }
            }
            page_loading('done');
            $('.new_contact').on("click",function(){
                gotoURL(htaccess.tarifs);
            });
        } else {
            gotoURL(htaccess.home);
        }
    });
}
function clients(clients_list) {
    var list = '';
    var hides = 0;
    var with_hides = 0;
    $.each(clients_list, function(key, data) {
        if(data.contact.settings.hide == 1 && session_show_hides == 0) {
            hides++;
            with_hides++;
        } else {
            if(data.contact.settings.hide) {
                with_hides++;
            }
            list += create_client_item(data);
        }
        if(data.im_parent == 1) {
            var link = htaccess.client;
        } else {
            var link = htaccess.sms;
        }
        $('#my_contacts').on("click", '#client_'+data.keyword, function(){
            gotoURL(link, 'nc', '/'+data.keyword);
        });
    });
    if(!list && hides) {
        list = 'Seznam kontaktů je prázdný.' +
            '<br>Ve vašich kontaktech máte skryté kontakty <strong>('+hides+')</strong>' +
            '<br>Pro jejich zobrazení <span id="show_hides" class="text-link">klikněte zde <span class="a fa-ar-right"></span>' +
            '</span>';
    }
    if(with_hides > 0 && (session_show_hides == 1)) {
        list = '<div class="text-center"><span class="text-danger">zobrazují se i skryté kontakty</span> ' +
            ' <span class="text-link" id="cancel-hides">zrušit</span></div><hr>' + list;
        $('#hides_info').hide();
    }
    if(with_hides > 0 && (session_show_hides == 0)) {
        $('#hides_info').show().html('některé ('+with_hides+') vaše kontakty jsou skryté - ' +
            '<span id="show-hidden" class="text-link">zobrazit</span>');
    }
    $('#my_contacts').on("click", '#cancel-hides', function(){
        toggle_hides(0);
    });
    $('#hides_info').on("click", '#show-hidden', function(){
        toggle_hides(1);
    });
    $('#my_contacts').html(list);
    $('#my_contacts').on("click", '#show_hides', function(){
        toggle_hides(1);
    });
}
function create_client_item(data){
    var client = data.client;
    var place = data.place;
    if(data.im_parent == 1) {
        var im_parent = '<br><span id="im_parent_'+data.keyword+'" class="fa fa-cog"></span> jste správce';
    } else {
        var im_parent = '<br><em class="text-gray"><span class="fa fa-cog"></span> nejste správce</em>';
    }

    if(data.contact == 0) {
        var smsleft = '';
        var mmsleft = '';
    } else {
        if(data.contact.sms.left == 0) {
            var smscolor = 'text-danger';
        } else {
            var smscolor = 'text-default';
            var br = '<br>';
        }
        if(data.contact.mms.left == 0) {
            var mmscolor = 'text-danger';
        } else {
            var mmscolor = 'text-default';
            var br = '<br>';
        }
        var smsleft = '<span class="'+smscolor+'"><span class="fa fa-mail"></span> '
            + data.contact.sms.left + ' ' + data.contact.sms.str+'</span>';
        var mmsleft = '<span class="'+mmscolor+'"><span class="fa fa-camera"></span> '
            + data.contact.mms.left + ' ' + data.contact.mms.str+'</span>';
    }
    if(data.contact.settings.hide == 1) {
        var hidden_contact = ' <span class="text-danger"><span class="fa fa-warning"></span> skrytý kontakt</span> ';
    } else {
        var hidden_contact = '';
    }
    return '<div id="client_'+data.keyword+'" style="margin:0 0 25px 0;" class="row cursorHand">' +
        '<div class="pull-left"><img id="avatar-'+data.keyword+'" src="'+client.avatar.data+'" class="avtrImgSmall"></div>' +
        '<div class="pull-left" style="margin-left:25px;">&nbsp;&nbsp;'+
        client.first_name+' '+client.last_name+' ('+client.dob+') ' + hidden_contact +
        '<em class="text-gray desktopOnly">'+data.keyword+'</em><br><span class="fa fa-location"></span> ' +
        '<span class="desktopOnly">'+place.name+'</span>' +
        '<span class="mobileOnly">'+place.nickname+'</span>' +
        '</div>' +
        '<div class="pull-right text-right clear-both-mobile">' +
        '<span id="sms_left_'+data.keyword+'">'+smsleft+'</span>&nbsp;&nbsp;' +
        '<span id="mms_left_'+data.keyword+'">'+mmsleft+'</span>' +
        '<span id="im_parent_'+data.keyword+'">'+im_parent+'</span>' +
        '</div>' +
        '</div>' +
        '<hr>';
}
function toggle_hides(action) {
    var query = {
        action: 'mylist-toggle-hide',
        show: action
    };
    callAPI_GET(query, function(data) {
        if(data.loginStatus == 'in') {
            refresh_page();
        } else {
            gotoURL(htaccess.home);
        }
    });
}