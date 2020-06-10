!function(t){"use strict";var e=function(e,s){this.options=s,this.$element=t(e).delegate('[data-dismiss="modal"]',"click.dismiss.modal",t.proxy(this.hide,this))};function s(t){this.$element.hide().trigger("hidden"),i.call(this)}function i(e){var s=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var i=t.support.transition&&s;this.$backdrop=t('<div class="modal-backdrop '+s+'" />').appendTo(document.body),"static"!=this.options.backdrop&&this.$backdrop.click(t.proxy(this.hide,this)),i&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),i?this.$backdrop.one(t.support.transition.end,e):e()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),t.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(t.support.transition.end,t.proxy(o,this)):o.call(this)):e&&e()}function o(){this.$backdrop.remove(),this.$backdrop=null}function n(){var e=this;this.isShown&&this.options.keyboard?t(document).on("keyup.dismiss.modal",function(t){27==t.which&&e.hide()}):this.isShown||t(document).off("keyup.dismiss.modal")}e.prototype={constructor:e,toggle:function(){return this[this.isShown?"hide":"show"]()},show:function(){var e=this,s=t.Event("show");this.$element.trigger(s),this.isShown||s.isDefaultPrevented()||(t("body").addClass("modal-open"),this.isShown=!0,n.call(this),i.call(this,function(){var s=t.support.transition&&e.$element.hasClass("fade");e.$element.parent().length||e.$element.appendTo(document.body),e.$element.show(),s&&e.$element[0].offsetWidth,e.$element.addClass("in"),s?e.$element.one(t.support.transition.end,function(){e.$element.trigger("shown")}):e.$element.trigger("shown")}))},hide:function(e){e&&e.preventDefault();e=t.Event("hide"),this.$element.trigger(e),this.isShown&&!e.isDefaultPrevented()&&(this.isShown=!1,t("body").removeClass("modal-open"),n.call(this),this.$element.removeClass("in"),t.support.transition&&this.$element.hasClass("fade")?function(){var e=this,i=setTimeout(function(){e.$element.off(t.support.transition.end),s.call(e)},500);this.$element.one(t.support.transition.end,function(){clearTimeout(i),s.call(e)})}.call(this):s.call(this))}},t.fn.modal=function(s){return this.each(function(){var i=t(this),o=i.data("modal"),n=t.extend({},t.fn.modal.defaults,i.data(),"object"==typeof s&&s);o||i.data("modal",o=new e(this,n)),"string"==typeof s?o[s]():n.show&&o.show()})},t.fn.modal.defaults={backdrop:!0,keyboard:!0,show:!0},t.fn.modal.Constructor=e,t(function(){t("body").on("click.modal.data-api",'[data-toggle="modal"]',function(e){var s,i=t(this),o=t(i.attr("data-target")||(s=i.attr("href"))&&s.replace(/.*(?=#[^\s]+$)/,"")),n=o.data("modal")?"toggle":t.extend({},o.data(),i.data());e.preventDefault(),o.modal(n)})})}(window.jQuery);var sitename = 'textojail.com';var www = 'www.' + sitename,https = 'https://' + www,api = https + '/nc/app-api/api.php',cdn_server = 'https://cdn.jsdelivr.net/gh/99electronic/cdn-v1.01/',defaults = {    sitename: sitename,    www_sitename: 'www.' + sitename,    https_sitename: 'https://' + www,    copyright: '99electronic.com' }, edditable_htaccess = {receipt: "receipt",home: "home",logout: "logout",compare: "compare",compare_pdf: "compare_pdf",mylist: "mylist",bulletins: "bulletins",bulletin: "bulletin",place: "place",places: "places",new_service: "new_service",change_tarif: "change_tarif",sms: "sms",faq: "faq",licence: "licence",licence_pdf: "licence_pdf",paylink: "paylink",invalid: "invalid",profile: "profile",tfa: "tfa",tarifs: "tarifs",register: "register",login: "login",prints: "prints",payments: "payments",lost_password: "lost_password",download_app: "download_app",new_ticket: "new_ticket",client: "client",mytarif: "mytarif",contacts: "contacts"},external_htaccess = {    facebook: 'https://www.facebook.com/smsdobasy/',    twitter: 'https://twitter.com/smsdobasy',    copyright: '99electronic.com',    appstore: 'https://itunes.apple.com/us/app/smsdobasy/id1316255978?mt=8',    playstore: 'https://play.google.com/store/apps/details?id=cz.smsdobasy.www',    payment_gateway: 'https://www.gopay.cz'},htaccess = $.extend(edditable_htaccess, external_htaccess),months = {    when:  ['ledna','února','března','dubna','května','června','července','srpna','září','října','listopadu','prosince'],    base:  ['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'],    short: ['led','úno','bře','dub','kvě','čer','črc','srp','zář','říj','lis','pro']};var main_menu = {
    in:{
        0: {
            url: htaccess.home,
            text:'Moje kontakty',
            cache: 0
        },
        1: {
            url: htaccess.tarifs,
            text:'Ceny/tarify',
            cache: 1
        },
        2: {
            url: htaccess.profile,
            text:'Účet',
            cache: 0
        },
        3: {
            url: htaccess.bulletins,
            text: 'bulletins',
            cache: 1
        },
        4: {
            url: logout,
            text: 'Odhlásit <span class="fa fa-logout"></span>',
            cache: 1
        }
    },
    out:{
        0: {
            url: htaccess.tarifs,
            text:'Ceny/tarify',
            cache: 1
        },
        1: {
            url: htaccess.register,
            text:'Nový účet',
            cache: 1
        },
        2: {
            url: htaccess.login,
            text:'Přihlásit <span class="fa fa-login"></span>',
            cache: 1
        }
    }
};var b64EncodeUnicode = function(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode(parseInt(p1, 16))
    }))
}
var b64DecodeUnicode = function(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
var hex_chr = "0123456789abcdef";
function rhex(num)
{
    str = "";
    for(j = 0; j <= 3; j++)
        str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
            hex_chr.charAt((num >> (j * 8)) & 0x0F);
    return str;
}

/*
 * Convert a string to a sequence of 16-word blocks, stored as an array.
 * Append padding bits and the length, as described in the MD5 standard.
 */
function str2blks_MD5(str)
{
    nblk = ((str.length + 8) >> 6) + 1;
    blks = new Array(nblk * 16);
    for(i = 0; i < nblk * 16; i++) blks[i] = 0;
    for(i = 0; i < str.length; i++)
        blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
    blks[i >> 2] |= 0x80 << ((i % 4) * 8);
    blks[nblk * 16 - 2] = str.length * 8;
    return blks;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function add(x, y)
{
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left
 */
function rol(num, cnt)
{
    return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * These functions implement the basic operation for each round of the
 * algorithm.
 */
function cmn(q, a, b, x, s, t)
{
    return add(rol(add(add(a, q), add(x, t)), s), b);
}
function ff(a, b, c, d, x, s, t)
{
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function gg(a, b, c, d, x, s, t)
{
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function hh(a, b, c, d, x, s, t)
{
    return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a, b, c, d, x, s, t)
{
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Take a string and return the hex representation of its MD5.
 */
function calcMD5(str)
{
    x = str2blks_MD5(str);
    a =  1732584193;
    b = -271733879;
    c = -1732584194;
    d =  271733878;

    for(i = 0; i < x.length; i += 16)
    {
        olda = a;
        oldb = b;
        oldc = c;
        oldd = d;

        a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
        d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
        c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
        b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
        a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
        d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
        c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
        b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
        a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
        d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
        c = ff(c, d, a, b, x[i+10], 17, -42063);
        b = ff(b, c, d, a, x[i+11], 22, -1990404162);
        a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
        d = ff(d, a, b, c, x[i+13], 12, -40341101);
        c = ff(c, d, a, b, x[i+14], 17, -1502002290);
        b = ff(b, c, d, a, x[i+15], 22,  1236535329);

        a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
        d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
        c = gg(c, d, a, b, x[i+11], 14,  643717713);
        b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
        a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
        d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
        c = gg(c, d, a, b, x[i+15], 14, -660478335);
        b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
        a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
        d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
        c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
        b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
        a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
        d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
        c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
        b = gg(b, c, d, a, x[i+12], 20, -1926607734);

        a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
        d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
        c = hh(c, d, a, b, x[i+11], 16,  1839030562);
        b = hh(b, c, d, a, x[i+14], 23, -35309556);
        a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
        d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
        c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
        b = hh(b, c, d, a, x[i+10], 23, -1094730640);
        a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
        d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
        c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
        b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
        a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
        d = hh(d, a, b, c, x[i+12], 11, -421815835);
        c = hh(c, d, a, b, x[i+15], 16,  530742520);
        b = hh(b, c, d, a, x[i+ 2], 23, -995338651);

        a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
        d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
        c = ii(c, d, a, b, x[i+14], 15, -1416354905);
        b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
        a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
        d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
        c = ii(c, d, a, b, x[i+10], 15, -1051523);
        b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
        a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
        d = ii(d, a, b, c, x[i+15], 10, -30611744);
        c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
        b = ii(b, c, d, a, x[i+13], 21,  1309151649);
        a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
        d = ii(d, a, b, c, x[i+11], 10, -1120210379);
        c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
        b = ii(b, c, d, a, x[i+ 9], 21, -343485551);

        a = add(a, olda);
        b = add(b, oldb);
        c = add(c, oldc);
        d = add(d, oldd);
    }
    return rhex(a) + rhex(b) + rhex(c) + rhex(d);
}
//MD5 script ends

function gotoLoginPage() {
    gotoURL(htaccess.login, 'nc');
}
$('#pop-menu').on("click", function(){
    openNav();
});

function construct_main_menu(status, bulletins) {
    if(status == 'in') {
        var links = main_menu.in;
    } else {
        var links = main_menu.out;
    }
    var lis = '';
    $.each(links, function(key, value){
        if(value.cache == 1) {
            var cache = 'st';
        } else {
            var cache = 'nc';
        }

        if(value.text == 'bulletins' && bulletins) {
            if(bulletins.unread > 0) {
                var bulletins_color = 'text-danger';
            } else {
                var bulletins_color = '';
            }
            value.text = '<span class="'+bulletins_color+'"><span class="fa fa-mail"></span> ('+bulletins.unread+')</span>';
        }
        lis += '<li><a class="cursorHand main-menu-link-'+key+'"><span class="menu-link">'+value.text+'</span></a></li>';
        $('#main-menu,#top-menu-mobile-links').on("click", '.main-menu-link-'+key, function(){
            gotoURL(value.url, cache);
        });
    });
    $('#pop-menu').html('<span class="fa fa-menu"></span>');
    $('#main-menu').html(lis);
}

function gotoURL(url, cache, vars, blank, return_url_only) {
    if ($.isFunction(url)) {
        url();
    } else {
        if(url.substring(0, 8) == 'https://' || url.substring(0, 7) == 'http://') {
            window.location.href = url;
        } else {
            if (!vars) {
                vars = '';
            }
            if (!cache) {
                cache = '/';
            } else {
                cache = '/' + cache + '/';
            }
            if(return_url_only) {
                return cache + url + vars;
            } else {
                if (blank == 1) {
                    window.open(cache + url + vars, '_blank');
                } else {
                    window.location.href = cache + url + vars;
                }
            }
        }
    }
}

function openNav() {
    $('#top-menu-mobile-links').html($('#main-menu').html());
    if(document.getElementById("myNav").style.width == "100%") {
        document.getElementById("myNav").style.width = "0%";
        $('#pop-menu').html('<div class="fa fa-menu"></div>');
    } else {
        document.getElementById("myNav").style.width = "100%";
        $('#pop-menu').html('<div class="fa fa-cancel" style="font-size: x-large;margin:9px 4px 0 0;"></div>');
    }
}

// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 70;
var navbarHeight = '33';

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();
    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;
    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $('header').removeClass('nav-down').addClass('nav-up');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            showHeader();
        }
    }
    lastScrollTop = st;
}

function showHeader() {
    $('header').removeClass('nav-up').addClass('nav-down');
}

jQuery(function($) {
    function tog(v){return v?'addClass':'removeClass';}
    $(document).on('input', '.clearable', function(){
        $(this)[tog(this.value)]('x');
    }).on('mousemove', '.x', function( e ){
        $(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]('onX');
    }).on('touchstart click', '.onX', function( ev ){
        ev.preventDefault();
        $(this).removeClass('x onX').val('').change();
    });
});

var APIurl =function(queryObj) {
    queryObj.timestamp = jQuery.now();
    queryObj.platform = 'www';
    var querystr = b64EncodeUnicode(JSON.stringify(queryObj));
    var url = api + '?query=' + querystr + '&json=json';
    return url;
}

function callAPI_GET(vars, fn) {
    var url = APIurl(vars);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            timestamp = data.time.unix;
            fn(data);
        },
        error: function(error){}
    });
}

function callAPI_POST(action, post_data, fn) {
    post_data['action'] = action;
    post_data['timestamp'] = jQuery.now();
    post_data['json'] = 'json';
    post_data['platform'] = 'www';
    $.ajax({
        url: api,
        type: 'POST',
        dataType: 'json',
        data: post_data,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            timestamp = data.time.unix;
            fn(data);
        },
        error: function(error){}
    });
}

function errcolor(error) {
    return '<span class="text-'+error[0]+'">'+error.str+'</span>';
}

function print_r(data) {
    alert(JSON.stringify(data));
}

function errormodal(e, header, fn) {
    if(Array.isArray(e)) {
        var error = '';
        $.each(e, function(key){
            error += errcolor(e[key]) + '<br>';
        });
        e = error;
    } else {
        e = errcolor(e);
    }
    $('#error-error').html(e);
    if(header) {
        $('#modalerror_Label').html(header);
    }
    $('#modalerror').modal('show');
    if(fn) {
        $('#cb1_error').on("click", function(){
            fn();
        });
    } else {
        $('#cb1_error').on("click", function(){
            $('#modalerror').modal('hide');
        });
    }
}

function validateEmail(email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test(email);
}

function progresschart(form) {
    var li = '';
    var state = '';
    var width = (100/form.progresschart.items);
    $.each(form.progresschart.data, function(key, val){
        if(val.active == 1) {
            state = ' class="active"';
        } else {
            state = '';
        }
        li += '<li'+state+' style="width:'+width+'%;">'+val.str+'</li>';
    });
    $('.progressbar').html(li);
}

function logout() {
    var query = {
        action: 'logout'
    };
    callAPI_GET(query, function() {
        gotoURL(htaccess.home);
    });
}

function page_loading(action, back_button_icon, back_button_text, back_button_function){
    if(action == 'done') {
        setTimeout(function(){
            $('#loaded-container').show();
            $('#loader').hide();
        }, 750);
        faq_hooks();
    }
    if(action == 'start') {
        if(back_button_function) {
            $('#wrapper-back-button').on("click", back_button_function)
                .html('<span class="fa '+back_button_icon+'">' +
                    '</span>'+back_button_text);
        }
        $('#loaded-container').hide();
        $('#loader').show();
        refresh_page();
    }
}

function paging_element(paging, fn) {
    if(paging.pages == 1) {
        return '';
    } else {
        if(paging.next.show == 1) {
            var next = ' <span class="fa fa-angle-right text-link next-page"></span>';
            $('.paging').on("click", '.next-page', function(){
                fn(paging.next.page_number);
            });
        } else {
            var next = '';
        }
        if(paging.back.show == 1) {
            var back = '<span class="fa fa-angle-left text-link back-page"></span> ';
            $('.paging').on("click", '.back-page', function(){
                fn(paging.back.page_number);
            });
        } else {
            back = '';
        }
        return back + paging.page+' / '+ paging.pages + next;
    }
}

function faq_hooks() {
    setTimeout(function(){
        var hook = '';
        $("[class^=hook-]").each(function() {
            hook = $(this).attr('class').split('-');
            $(this).attr('href', '/st/'+htaccess.faq+'/'+[hook[1]]);
        });
        //set internal links
        var link = new Array();
        $("[class^=link-]").each(function() {
            link = $(this).attr('class').split('-');
            $(this).attr('href', '/'+htaccess[link[1]]);
        });
        //set external links
        var url = new Array();
        $("[class^=url-]").each(function() {
            url = $(this).attr('class').split('-');
            $(this).attr('href', htaccess[url[1]]);
        });
        //fill default values to html
        var text = new Array();
        $("[class^=fill-]").each(function() {
            text = $(this).attr('class').split('-');
            $(this).html(defaults[text[1]]);
        });
    }, 1500);
}
