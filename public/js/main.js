$(document).ready(function() {
    $('#chat-box').hide();
    $(document).on('click', '.guest-user', function () {
        $(this).find('.guest-status').html('');
        $('#chat-box').show();
        $('#spr .check_setup').hide();
        var guestUserId = $(this).attr('id');
        $.get('/show-message-guest-user', {id: guestUserId}, function(res) {
            var list = ``;
            for (let i = 0; i < res.messages.length; i++) {
                if (res.messages[i].sender_id == res.agent_id ) {
                    list += `
                        <li class="self">
                            <div class="avatar"><img src="https://i.imgur.com/HYcn9xO.png" draggable="false"/></div>
                            <div class="msg">
                                <p>${res.messages[i].content }</p>
                                <time>${res.messages[i].updated_at }</time>
                            </div>
                        </li>
                    `;
                }
                list += `
                    <li class="other">
                        <div class="avatar"><img src="https://i.imgur.com/DY6gND0.png" draggable="false"/></div>
                        <div class="msg">
                            <p>${res.messages[i].content }</p>
                            <time>${res.messages[i].updated_at }</time>
                        </div>
                    </li>
                `;
            }

            $('#chat-box .chat').html(list);
        });
    })
})