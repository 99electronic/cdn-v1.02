$(document).ready(function() {
    page_loading(
        'start',
        'fa-angle-left',
        'zpět',
        function () {
            gotoURL(htaccess.bulletins);
        }
    )
});
function refresh_page() {
    var query = {
        action: 'bulletin-item',
        id: $('#id').val()
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if(data.success) {
            var item = data.bulletin;
            $('#header-title-text').html(item.subject);
            $('#date').html(item.date.str);
            $('#message').html(bulletin_template(item));
            $('#delete').on("click", function(){
                bulletin_delete();
            });
        } else {
            gotoURL(htaccess.invalid);
        }
        page_loading('done');
    });
}
function bulletin_delete(){
    var query = {
        action: 'bulletin-delete',
        id: $('#id').val()
    };
    callAPI_GET(query, function (data) {
        if (data.success || data.errors[0].id==2) {
            gotoURL(htaccess.bulletins);
        }
    });
}

function bulletin_template(item) {
    var message;
    if(!item.template) {
        message = item.message;
    } else {
        //1 = returned letter
        if(item.template == 1) {
            message = 'Dne '+item.data.return_date.str + ' se dopis číslo ' + item.data.printIndex +
                ' vrátil odesílateli (nám). Prosím zjistěte si zda jste uvedli správnou věznici, nebo zda nedošlo k přemístění' +
                ' do jiné věznice atd.<br>' +
                'Pokud máte další otázky ohledně vrácených dopisů, ' +
                '<a href="javascript:void(0);" class="hook-returned_letter">klikněte zde <span class="fa fa-angle-right"></span></a>';
        }
        //2 = welcome new user!
        if(item.template == 2) {
            message = 'Dobrý den,<br>' +
                'Vítáme vás v naší aplikaci '+sitename+'!<br>' +
                'Odesílání dopisů do českých věznic bude od této chvíle maličkost! zvládnete to odkudkoli a kdykoli ' +
                'použitím vašeho chytrého mobilu, nebo na stránkách www.smsdobasy.cz.<br>' +
                'V hlavním menu najdete odkazy na <a href="/'+htaccess.faq+'">časté dotazy</a> ' +
                'nebo na <a href="/'+htaccess.new_ticket+'">kontaktní formulář</a>, ' +
                'kde nás můžete v případě problémů kontaktovat.<br>' +
                'Přejeme vám příjemný den!<br>' +
                'Tým '+sitename;
        }
        $('#header-title-text').html(item.subject);
    }
    return message;
}
