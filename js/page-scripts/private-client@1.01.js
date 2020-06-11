var timestamp,release_date,keyword,contact_i,contacts,parent,place,service,token;
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
        action: 'client',
        keyword: $('#keyword').val()
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if(data.loginStatus == 'in') {
            if(data.errors) {
                gotoURL(htaccess.invalid);
            } else {
                fillData(data);
                page_loading('done');
            }
        } else {
            gotoLoginPage();
        }
    });
}
function fillData(data) {
    parent = data.service.parent;
    contacts = data.service.contacts;
    var messages = contacts.messages;
    service = data.service.data;
    place = data.service.place;
    contact_i = contacts.me;
    var tarif = data.service.tarif;
    keyword = data.service.keyword;
    token = data.service.token;
    $('.keyword').html(keyword);
    $('.client-name').html(service.first_name + ' '
        + service.last_name + ' (nar.'+service.dob+')');
    $('#place-name-desktop').html(place.name)
        .off("click").on("click", function(){
            gotoURL(htaccess.place, 'st', '/'+place.id+'/'+keyword);
        });
    $('#place-name-mobile').html(place.nickname);
    $('.place-link').prop('href', '/st/'+htaccess.place+'/'+place.id);
    $('.avatar-src').attr('src', service.avatar.data);
    if(service.release_date != 0) {
        release_date = service.release_date.date.date;
        $('#release_date_desktop').html(service.release_date.date.str.full);
        $('#release_date_mobile').html(service.release_date.date.str.short);
        $('#release_date_result').html('Výstup: '+service.release_date.date.str.full);
        if(service.release_date.result == 'ended') {
            service.release_date.result = 'ukončeno';
        }
        $('.release_info').html('('+service.release_date.result+')');
        $('#remove_release_date_link').show();
        $('.release_undefined').hide();
        $('.release_defined').show();
    } else {
        $('#remove_release_date_link').hide();
        $('.release_undefined').show();
        $('.release_defined').hide();
        $('#release_date_result').html('Výstup: neuvedeno');
    }
    $('#remove_release_date').off("click").on("click", function(){
        submit_release_date(1);
    });
    $('.release_modal').off("click").on("click", function(){
        open_release_date_modal();
    });
    $('#cb2_release_date').off("click").on("click",function(){
        submit_release_date();
    });
    $('#desktop-avatar-link').off("click").on("click", function(){
        $('#modalavatar').modal('show');
    });
    $('#message_button').off("click").on("click", function(){
        window.location.replace('/'+htaccess.sms+'/'+keyword)
    });
    if(messages) {
        $('.sms-left').html(messages.sms.left);
        $('.mms-left').html(messages.mms.left);
        $('#tarif-sms-limits-desktop').html(
            ' - ' + tarif.sms.ctn + ' ' + tarif.sms.str + ' každý den' +
            ' (až ' + tarif.sms.len + ' znaků na zprávu)'
        );
        $('#tarif-sms-limits-mobile').html(
            ' - ' + tarif.sms.ctn + ' ' + tarif.sms.str + ' každý den' +
            ' (max. ' + tarif.sms.len + 'zn.)'
        );
    }
    $('.tarif-nickname').html(tarif.nickname);
    $('#male-avatar').off("click").on("click", function(){
        set_avatar(1);
    });
    $('#female-avatar').off("click").on("click", function(){
        set_avatar(2);
    });
    $('#custom-avatar').off("click").on("click", function(){
        $('#modalavatar').modal('hide');
        $('#file').trigger('click');
    });
    $('#ddays-label').html(tarif.ddays.label);
    $('#ddays-result').html(tarif.ddays.result.auto);
    if(contacts.sharing.total > 1 || contacts.sharing.total == 0) {
        $('#sharing-label').html('Sdílení služby - uživatelé');
        if(contacts.sharing.total == 0) {
            var e = 'Abyste mohli služby využívat, je potřeba přidat uživatele, kteří budou zprávy odesílat.'+
                'Pokud chcete zprávy odesílat vy,';
            //errormodal([{id:1,str:e,0:'success'}], 'Založit nového odesílatele');
        }
    } else {
        $('#sharing-label').html('uživatel služby');
    }
    $('#tarif-end-label1,#tarif-end-info-date_str').removeClass();
    $('#tarif-end-label1,#tarif-end-info-date_str').addClass('text-default');
    $('.send-sms-button').hide();
    var payment_link = '';
    if(tarif.end.state == 0) {
        $('#tarif-end-label1').html('Neaktivováno');
        payment_link = 'Zaplatit a zaktivovat';
    }
    if(tarif.end.state == 1 || tarif.end.state == 2) {
        if(messages.sms.left || messages.mms.left) {
            if(messages.sms.left && messages.mms.left) {
                $('#send-sms-button-label').html('Odeslat zprávu nebo foto');
                }
            if(messages.sms.left && !messages.mms.left) {
                $('#send-sms-button-label').html('Odeslat zprávu');
                }
            if(!messages.sms.left && messages.mms.left) {
                $('#send-sms-button-label').html('Odeslat foto');
            }
            $('#send-sms-button').show();
            $('#send-sms-button').off("click").on("click",
                function(){
                gotoURL(htaccess.sms, 'nc', '/'+keyword);
            });
        }
        payment_link = 'Zaplatit - prodloužit';
        $('#tarif-end-label1').html(tarif.end.label1);
        $('#tarif-end-info-date_str').html(tarif.end.date.str.full);
        if(tarif.end.state == 1) {
            $('#tarif-end-info-result').html(' (' + tarif.end.label2 + ' ' + tarif.end.result + ')');
        }
        $('#mms-limit-label').show();
    } else {
        $('#sms_button_container').hide();
    }
    if(tarif.end.state == 3) {
        payment_link = 'Zaplatit - znovu aktivovat';
        $('#tarif-end-label1,#tarif-end-info-date_str').removeClass();
        $('#tarif-end-label1,#tarif-end-info-date_str').addClass('text-danger');
        $('#tarif-end-label1').html(tarif.end.label1);
        $('#tarif-end-info-date_str').html(tarif.end.date_str);
    }
    $('#payment-link').html(payment_link + '<span class="fa fa-angle-right"></span>');
    $('#payment-link').on("click", function(){
        open_payment();
    });
    $('.update-place-button').off("click").on("click", function(){
        open_places();
    });
    $('#payments-history-link').off("click").on("click", function() {
        gotoURL(htaccess.payments, null, '/1/'+keyword);
    });
    $('#tarif-details').off("click").on("click", function() {
        gotoURL(htaccess.mytarif, 'nc', '/'+keyword);
    });
    $('.waits-content').html(waiting_messages());
    $('.toggleSwitch').removeClass('fa-toggle-on').addClass('fa-toggle-off');
    toggle_switch(0, contacts.list[contact_i].appsettings.hide);
    $('#switch0').off("click").on("click", function() {
        toggle_hide();
    });
    if(data.payments == 1) {
        $('#payment-history-link').show();
    }
    if(data.payments == 0) {
        $('#payment-history-link').hide();
    }
    contact_list();
}
function toggle_switch(i, state) {
    if(state == 0) {
        $('#hidden-info').hide();
        $('#switch'+i).removeClass('fa-toggle-on text-danger').addClass('fa-toggle-off');
    } else {
        $('#hidden-info').show();
        $('#switch'+i).removeClass('fa-toggle-off').addClass('fa-toggle-on text-danger');
    }
}
function toggle_hide() {
    var query = {
        action: 'contact-hide',
        keyword: $('#keyword').val()
    };
    callAPI_GET(query, function(data) {
        if(data.loginStatus == 'in') {
            if(data.success) {
                toggle_switch(0, data.hide_state);
            } else {
                gotoURL(htaccess.invalid_link, 'st');
            }
        } else {
            gotoLoginPage();
        }
    });
}
function waiting_messages() {
    if(service.waiting.all.sms && service.waiting.all.mms) {
        var waits = service.waiting.all.sms + ' sms + ' + service.waiting.all.mms + ' foto';
    }
    if(service.waiting.all.sms && !service.waiting.all.mms) {
        var waits = service.waiting.all.sms + ' sms';
    }
    if(!service.waiting.all.sms && service.waiting.all.mms) {
        var waits = service.waiting.all.mms + ' foto';
    }
    if(!service.waiting.all.sms && !service.waiting.all.mms) {
        var waits = 'žádné sms/foto';
    }
    return waits;
}
function open_places() {
    var selected = '';
    var query = {
        action: 'place-list'
    };
    callAPI_GET(query, function(data) {
        $('#places-options').children().remove().end()
        $.each(data.places, function(key, value) {
            if(value.id == place.id) {
                selected = ' selected';
            } else {
                selected = '';
            }
            $('#places-options').append('<option value="'+value.id+'"'+selected+'>'+value.nickname+'</option>');
        });
    });
    $('#places-options').on("change", function(){
        load_place();
    });
    $('#place_address').html(place.address.street+' '+place.address.number+'<br>'+place.address.city+' '+place.address.zip);
    $('#place_details').val(place.address.details);
    $('#cb2_update_place').off("click").on("click", function(){
        update_place();
    });
    $('#modalupdate_place').modal('show');
}
function load_place() {
    var query = {
        action: 'place',
        id: $('#places-options').val()
    };
    callAPI_GET(query, function(data) {
        $('#place_address').html(data.address.postal.street+' '+data.address.postal.number+
            '<br>'+data.address.postal.city+' '+data.address.postal.zip);
        $('#place_details').val('');
    });
}
function update_place() {
    var query = {
        action: 'client-update-place',
        id: $('#places-options').val(),
        place_details: $('#place_details').val(),
        keyword: keyword,
        token: token
    };
    callAPI_GET(query, function(data) {
        if(data.loginStatus == 'in') {
            if (data.success) {
                place = data.place;
                $('#place-name-desktop').html(data.place.name);
                $('#place-name-mobile').html(data.place.nickname);
                $('#modalupdate_place').modal('hide');
            } else {
                gotoURL(htaccess.invalid_link, 'st');
            }
        } else {
            gotoLoginPage();
        }
    });
}
function open_payment() {
    var query = {
        action: 'payment-options',
        keyword: keyword,
        token: token
    };
    callAPI_GET(query, function(data) {
        if(data.loginStatus == 'in') {
            if(data.success) {
                var options = data.options.duration_options;
                $('#modalpayment').modal('show');
                $('#cb2_payment').hide();
                if (data.options.activation == 1) {
                    $('#two-weeks-notice').show();
                    $('#two-weeks-notice-accepted').hide();
                } else {
                    $('#two-weeks-notice').hide();
                    $('#two-weeks-notice-accepted').show();
                }
                $('#two-weeks-notice-button').off("click").on("click", function () {
                    $('#two-weeks-notice').hide();
                    $('#two-weeks-notice-accepted').show();
                });
                $('#duration').on("change", function () {
                    prepare_payment();
                });
                $('#duration').children().remove().end()
                    .append('<option selected value="0">-- vyberte délku objednávky --</option>');
                $.each(options, function (key) {
                    $('#duration').append('<option value="' + options[key].months + '">' +
                        +options[key].months + ' ' + options[key].label + ': ' + options[key].price_label + '</option>');
                });
            } else {
                //existing waiting payments
                if(data.errors[0].id==2) {
                    $('#modalwaiting_payment').modal('show');
                    $('#cb2_waiting_payment').off("click").on("click", function(){
                        gotoURL(htaccess.payments, null, '/1/'+keyword);
                    });
                    $('#waiting_payment_ordernumber').html(data.errors[0].str);

                }
                //maximum months prepaid
                if(data.errors[0].id==4) {
                    errormodal(
                        data.errors,
                        '<span class="fa fa-danger"></span> Upozornění'
                    );
                }
            }
        } else {
            gotoLoginPage();
        }
    });
}
function prepare_payment() {
    var query = {
        action: 'payment-prepare',
        keyword: keyword,
        duration: $('#duration').val(),
        token: token
    };
    callAPI_GET(query, function(data) {
        if(data.loginStatus == 'in') {
            $('#cb2_payment').show();
            $('#gopay_redirect_info').hide();
            if(data.address) {
                var address = data.email+'<br>'+data.address[0]+' '+data.address[1]+
                    '<br>'+data.address[2]+
                    '<br>'+data.address[3]+' '+data.address[2]
            } else {
                var address = data.email;
            }
            if(data.price.vat > 0) {
                var total = 'Celkem (s DPH '+data.price.vat+'%) '+data.price.price_label;
            } else {
                var total = 'Celkem '+data.price.price_label;
            }
            if(data.price.units > 1) {
                total += ' ('+data.price.unit_price_label+'/měs)'
            }
            $('#prepayment-info').html(
                'od '+data.limits.newstart_str+' do '+data.limits.newend_str+
                '<br>'+total+
                '<hr>Kontakt plátce: <br>'+address+'<br><br>'
            );
            $('#cb2_payment').off("click").on("click", function(){
                gotoURL(htaccess.paylink, 'nc', '/'+data.paylink);
            });
        } else {
            gotoLoginPage();
        }
    });
}
function contact_list() {
    var list = '';
    $.each(contacts.list, function( key) {
        list += create_contact_list_item(key);
        $('#users_list').on("click", '#list_item_link_'+key, function(){
            edit_contact(key);
        });
    });
    $('#users_list').html(list);
}
function create_contact_list_item(i) {
    var style = '';
    var user = contacts.list[i];
    if(user.active) {
        if(user.ban == 1) {
            style = " style='text-decoration:line-through;'";
        } else {
            style = '';
        }
        var list_item = '<div id="contact_'+i+'"'+style+'><span class="monospaced">'+
            i + ') </span><span class="fa fa-user text-success" id="list_item_ico_'+i+'"></span>' +
            '<span id="list_item_name_'+i+'">'+
            user.name+'</span> <span id="list_item_email_'+i+'" class="desktopOnly">- '+user.email+
            '</span> - <span class="text-link" '+
            'id="list_item_link_'+i+'">upravit '+
            '<span class="fa fa-angle-right"></span></span></div>';
    } else {
        var list_item = '<div id="contact_'+i+'"><span class="monospaced">' + i + ') </span>' +
            '<span class="fa fa-user text-gray"  id="list_item_ico_'+i+'"></span>'+
            '<span id="list_item_name_'+i+'">volný kontakt</span> ' +
            '<span id="list_item_email_'+i+'" class="desktopOnly">- nepoužito</span> - '+
            '<span class="text-link" ' +
            'id="list_item_link_'+i+'">přidat <span class="fa fa-angle-right"></span>'+
            '</span></div>';
        $('#contact_'+i).css('text-decoration', 'none');
    }
    return list_item;
}
function edit_contact(i) {
    var user = contacts.list[i];
    $('#modalcontact').modal('show');
    $('#modalcontact_email').val(user.email);
    $('#modalcontact_name').val(user.name);
    if(user.active == 0) {
        $('#modalcontact_ban').html('');
    } else {
        if(user.ban == 0) {
            $('#modalcontact_ban').html('Zablokovat');
        } else {
            $('#modalcontact_ban').html('Odblokovat');
        }
    }
    $('#modalcontact_error').html('');
    $('#modalcontact_ban').off("click").on("click", function(){
        ban_contact();
    });
    $('#modalcontact_header_i').html(i);
    $('#modalcontact_i').val(i);
    $('#cb2_contact').off("click").on("click",function(){
        update_contact();
    });
}
function ban_contact() {
    var i = $('#modalcontact_i').val();
    var query = {
        action: 'contact-ban',
        keyword: keyword,
        token: token,
        contact_i: i
    };
    callAPI_GET(query, function(data) {
        if(data.loginStatus == 'in') {
            if (data.success) {
                if (data.ban == 1) {
                    $('#modalcontact_ban').html('Odblokovat');
                    $('#modalcontact_error').html('Zablokováno OK!');
                    $('#contact_' + i).css('text-decoration', 'line-through');
                    contacts.list[i].ban = 1;
                }
                if (data.ban == 0) {
                    $('#modalcontact_ban').html('Zablokovat');
                    $('#modalcontact_error').html('Odblokováno OK!');
                    $('#contact_' + i).css('text-decoration', 'none');
                    contacts.list[i].ban = 0;
                }
            } else {
                $('#modalcontact_error').html(data.errors);
            }
        } else {
            gotoLoginPage();
        }
    });
}
function update_contact() {
    var i = $('#modalcontact_i').val();
    var query = {
        action: 'contact-update',
        keyword: keyword,
        token: token,
        contact_i: i,
        name: $('#modalcontact_name').val(),
        email: $('#modalcontact_email').val()
    };
    callAPI_GET(query, function(data) {
        if(data.loginStatus == 'in') {
            if (!data.errors && data.result) {
                contacts.list[i] = {
                    name:data.result.name,
                    email:data.result.email,
                    ban: data.result.ban
                };
                $('#list_item_name_'+i).html(data.result.name);
                $('#list_item_email_'+i).html(data.result.email);
                $('#list_item_ico_'+i).removeClass('text-gray').addClass('text-success');
                $('#list_item_link_'+i).html('upravit <span class="fa fa-angle-right"></span>');
                $('#modalcontact').modal('hide');
            } else {
                $('#modalcontact_error').html(data.errors);
            }
        } else {
            gotoLoginPage();
        }
    });
}
function open_release_date_modal() {
    var date = new Date(timestamp*1000);
    var start_year = date.getFullYear();
    $('#release_year,#release_month,#release_day').empty();
    if(release_date) {
        var rd = release_date.split('-');
        var year = rd[0];
        var month = rd[1];
        var day = rd[2];
    } else {
        var month = date.getMonth();
        var day = date.getDay();
    }
    $('#modalrelease_date').modal('show');
    var i = 0;
    while(i < 50) {
        if(year == start_year+i) {
            s = ' selected';
        } else {
            s = '';
        }
        $('#release_year').append('<option value="'+(start_year+i)+'"'+s+'>'+(start_year+i)+'</option>');
        i++;
    }
    var i = 0;
    var s = '';
    while(i < 12) {
        if(month == (i+1)) {
            s = ' selected';
        } else {
            s = '';
        }
        $('#release_month').append('<option value="'+(i+1)+'"'+s+'>'+months.base[i]+'</option>');
        i++;
    }
    var i = 1;
    var s = '';
    while(i < 32) {
        if(day == i) {
            s = ' selected';
        } else {
            s = '';
        }
        $('#release_day').append('<option value="'+i+'"'+s+'>'+i+'</option>');
        i++;
    }
}
function submit_release_date(remove) {
    var query = {
        action: 'client-release',
        keyword: keyword,
        token: token,
        remove: remove,
        year:$('#release_year').val(),
        month:$('#release_month').val(),
        day:$('#release_day').val()
    };
    callAPI_GET(query, function(data) {
        if(data.success) {
            location.reload();
        } else {
            $('#modalrelease_date').modal('hide');
            errormodal(data.errors);
        }
    });
}
function set_avatar(ico) {
    var query = {
        action: 'client-avatar-ico',
        keyword: keyword,
        token: token,
        ico: ico
    };
    callAPI_GET(query, function(data) {
        if(data.loginStatus == 'in') {
            $('.avatar-src').attr('src', data.avatar.data);
            $('#modalavatar').modal('hide');
        } else {
            gotoLoginPage();
        }
    });
}
function upload_avatar(cropp_data) {
    var query = {
        keyword: keyword,
        token: token,
        image: cropp_data
    };
    callAPI_POST('client-avatar-img', query,function(data) {
        if(data.loginStatus == 'in') {
            if (data.success) {
                $('.avatar-src').attr('src', data.avatar.data);
            } else {
                errormodal(data.errors);
            }
        } else {
            gotoLoginPage();
        }
    });
}
