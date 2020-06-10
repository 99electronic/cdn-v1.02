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