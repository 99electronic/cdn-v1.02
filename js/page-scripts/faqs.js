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
    var hooked_key = null;
    var query = {
        action: 'faq-list'
    };
    callAPI_GET(query, function(data) {
        construct_main_menu(data.loginStatus, data.bulletins);
        $('.answer').hide();
        if(data.success) {
            var list = '';
            $.each(data.faqs, function(key, value){
                if($('#hook').val() == value.hook && $('#hook').val()) {
                    hooked_key = key;
                }
                list += create_faqs_item(key, value);
                $('#faqs_container').on("click", '#faq_'+key, function(){
                    load_answer(key);
                });
            });
            $('#faqs_container').html(list);
            if(hooked_key) {
                setTimeout(function(){
                    load_answer(hooked_key);
                }, 1000);
            }
        } else {
            errormodal(data.errors);
        }
        page_loading('done');
    });
}
function create_faqs_item(key, faq) {
    return '<div>' +
        '<span>'+key+')</span> <span id="faq_'+key+'" class="text-link">'+faq.question+'</span>' +
        '<div style="margin-bottom:10px;"></div>' +
        '<div class="answer" id="answer_'+key+'" style="padding:10px;display:none;"></div>' +
        '</div>';
}
function load_answer(key){
    if($('#answer_'+key).html() == '') {
        $('.answer').hide('slow', function() {
            $(this).html('');
        });
        var query = {
            action: 'faq-item',
            id: key
        };
        callAPI_GET(query, function (data) {
            if (data.success) {
                $('#answer_' + key).html(data.answer).show('slow');
                $([document.documentElement, document.body]).animate({
                    scrollTop: $('#answer_'+key).offset().top - 40
                }, 2000);
            }
        });
    }
}