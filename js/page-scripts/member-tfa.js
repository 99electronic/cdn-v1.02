$(document).ready(function() {
    page_loading(
        'start',
        'fa-angle-left',
        'na profil',
        function(){
            gotoURL(htaccess.profile);
            });
});
function refresh_page() {
    var query = {
        action: 'tfa-enable'
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if(data.loginStatus == 'in') {
            $('#loaded-container').show();
            $('#loader').hide();
            $('#tfa_img').attr('src', data.img);
            $('#token_preview').html(data.token);
            $('#token').val(data.token);
            $('#submit').on("click", function(){
                password_prompt(submit_tfa);
            });
        }
        $('#tfa').on("focus", function(){
            if($('#tfa').val() == ' ') {
                $('#tfa').val('');
            }
        });
        page_loading('done');
    });
}
function submit_tfa() {
    $('#modalprompt').modal('hide');
    var query = {
        action: 'tfa-submit',
        tfa: $('#tfa').val(),
        token: $('#token').val(),
        password: $('#password').val()
    };
    callAPI_GET(query, function(data) {
        if(data.success) {
            errormodal(data.success, 'ok', function(){
                gotoURL(htaccess.profile);
            });
        } else {
            errormodal(data.errors);
        }
    });
}
function password_prompt(fn) {
    $('#modalprompt').modal('show');
    setTimeout(function () {
        $('#password').get(0).focus()
    }, 1000);
    $('#cb2_prompt').on("click", function(){fn()});
}