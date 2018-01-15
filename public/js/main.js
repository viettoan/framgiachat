$(document).ready(function() {
    $('#chat-box').hide();
    $('.guest-user').click(function () {
        $('#chat-box').show();
        $('#spr .check_setup').hide();
    })
})