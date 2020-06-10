$(document).ready(function() {
    var url = $('#url').val();
    if(htaccess[url]) {
       url = htaccess[url];
    } else {
       url = external_htaccess[url];
    }
    gotoURL(url, 'nc');
});