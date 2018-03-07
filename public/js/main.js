$(document).ready(function() {
    $('#chat-box').hide();

    $(document).on('click', '#upload-image', function () {
        $('#upload-file').click();
    });

    $(document).on('click', '.guest-user', function () {
        $(this).find('.guest-status').html('');
        $('#chat-box').show();
        $('#spr .check_setup').hide();
        var guestUserId = $(this).attr('id');
        $.get('/show-message-guest-user-agent-page', {id: guestUserId}, function(res) {
            var list = `<div class="menu">
                                <div class="back"><i class="fa fa-chevron-left"></i> <img src="https://i.imgur.com/DY6gND0.png" draggable="false"/></div>
                                <div class="name">Alex</div>
                                <div class="last">18:09</div>
                            </div>
                        <ol class="chat">`;
            for (let i = 0; i < res.messages.length; i++) {
                if (res.messages[i].sender_id == res.agent_id ) {
                    list += `
                        <li class="self">
                            <div class="avatar"><img src="https://i.imgur.com/HYcn9xO.png" draggable="false"/></div>
                            <div class="msg">
                                ${(res.messages[i].type_id == 0) ? `<img src="http://localhost:3000/images/${res.messages[i].content }">`: `<p>${res.messages[i].content }</p>`}
                                <time>${res.messages[i].updated_at }</time>
                            </div>
                        </li>
                    `;
                } else {
                    list += `
                        <li class="other">
                            <div class="avatar"><img src="https://i.imgur.com/DY6gND0.png" draggable="false"/></div>
                            <div class="msg">
                                ${(res.messages[i].type_id == 0) ? `<img src="http://localhost:3000/images/${res.messages[i].content }">`: `<p>${res.messages[i].content }</p>`}
                                <time>${res.messages[i].updated_at }</time>
                            </div>
                        </li>
                    `;
                }
                
            }
            list += `</ol>
                    <input class="textarea" type="text" data-user="${guestUserId}" id="agent-message" placeholder="Type here!"/>
                    <input type="file" id="upload-file" data-user="${guestUserId}">
                    <img src="http://localhost:3000/images/upload.png" id="upload-image">
                    `;
            $('#chat-box').html(list);
        });
    });

    $(document).on('click', '.guest-online', function () {
        $('#chat-box').show();
        $('#chat-box').html(`
            <div class="menu">
                <div class="back"><i class="fa fa-chevron-left"></i> <img src="https://i.imgur.com/DY6gND0.png" draggable="false"/></div>
                <div class="name">Alex</div>
                <div class="last">18:09</div>
            </div>
            <ol class="chat">
                
            </ol>
            <input class="textarea" type="text" data-guest="${ $(this).attr('id') }" id="agent-message-guest" placeholder="Type here!"/>
        `);
    });
});