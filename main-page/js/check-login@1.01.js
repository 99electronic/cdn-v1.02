$(document).ready(function() {
    var query = {
        action: 'check-login'
    };
    callAPI_GET(query, function(data) {
        if(data.success) {
            if(data.loginStatus == 'in') {
                gotoURL(htaccess.mylist);
            } else {
                $('body').css('visibility', 'visible');
            }
        }
    });
    $( "a.scrollLink" ).on('click', function( event ) {
        event.preventDefault();
        $("html, body").animate({ scrollTop: $($(this).attr("href")).offset().top }, 1500);
    });
    $('#start-with-email').on('click', function () {
        gotoURL(htaccess.register, 'nc', '/'+$('#passing_email').val());
    });
});


