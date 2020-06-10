$(document).ready(function() {
    page_loading(
        'start',
        'fa-angle-left',
        'na hlavní stránku',
        function () {
            gotoURL(htaccess.home);
        }
    );
});
function refresh_page() {
    var query = {
        action: 'tarif',
        id: $('#id').val()
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        if(data.success && data.loginStatus == 'in') {
            $('#tarif-name').html(data.tarif.name);
        } else {
            gotoLoginPage();
        }
    });
    var query = {
        action: 'place-list'
    };
    callAPI_GET(query, function(data) {
        $('#places-options').children().remove().end();
        $('#places-options').append('<option value="0" selected>--vyberte věznici--</option>');
        $.each(data.places, function(key, value) {
            $('#places-options').append('<option value="'+value.id+'">'+value.nickname+'</option>');
        });
    });
    $('#places-options').on("change", function(){
        load_place();
        form_precheck();
    });
    $('#dob-options').children().remove().end();
    $('#dob-options').append('<option value="0" selected>--vyberte rok narození--</option>');
    var i = 0;
    var d = new Date();
    var n = d.getFullYear() - 14;
    while(i < 86) {
        $('#dob-options').append('<option value="'+(n-i)+'">'+(n-i)+'</option>');
        i++;
    }
    $('#dob-options').on("change", function(){
        form_precheck();
    });
    $('#first_name').on("change input", function(){
        form_precheck();
    });
    $('#last_options').on("change input", function(){
        form_precheck();
    });
    $('#nickname').on("change input", function(){
        form_precheck();
    });
    $('#submit_form').on("click", function(){
        pre_submit_form();
    });
    page_loading('done');
    $('#step2').hide();
}
function load_place() {
    var query = {
        action: 'place',
        id: $('#places-options').val()
    };
    callAPI_GET(query, function(data) {
        $('.place_address').html(data.address.postal.street+' '+data.address.postal.number+
            '<br>'+data.address.postal.city+' '+data.address.postal.zip);
        $('#place_name').val(data.name);
        $('#place_details').show().val('');
    });
}
function form_precheck() {
    if($('#first_name').val() != '' && $('#last_name').val() != ''
    && $('#dob-options').val() != 0 && $('#places-options').val() != 0
    && $('#nickname').val().length > 1) {
        $('#button-container').show();
    } else {
        $('#button-container').hide();
    }
}
function pre_submit_form() {
    $('#step1').hide();
    $('#step2').show();
    $('#confirm_nickname').html($('#nickname').val());
    $('#confirm_first_name').html($('#first_name').val());
    $('#confirm_last_name').html($('#last_name').val());
    $('#confirm_dob').html($('#dob-options').val());
    $('#confirm_place_name').html($('#place_name').val());
    if($('#place_details').val() != '') {
        $('#confirm_place_details').html('('+$('#place_details').val()+')');
    } else {
        $('#confirm_place_details').html('');
    }
    $('#final_submit_form').on("click",function(){
        submit_form()
    });
    $('#edit').on("click",function(){
        $('#step1').show();
        $('#step2').hide();
    });
}
function submit_form() {
    var query = {
        action: 'tarif-create',
        id: $('#id').val(),
        token: $('#token').val(),
        first_name: $('#first_name').val(),
        last_name: $('#last_name').val(),
        dob: $('#dob-options').val(),
        place: $('#places-options').val(),
        place_detaisl: $('#place_details').val(),
        nickname: $('#nickname').val()
    };
    callAPI_GET(query, function(data) {
        if(data.success) {
            gotoURL(htaccess.client, 'nc', '/'+data.keyword);
        } else {
            errormodal(data.errors);
        }
    });
}