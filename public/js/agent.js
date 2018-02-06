$(document).ready(function() {
    var agent_id = JSON.parse('<%- JSON.stringify(agent._id) %>');
    socket.emit('agent-online', agent_id);
    socket.on('server-send-guest-new-message', function(data) {
        $('#newchat_support table tbody').find('#' + data.user_id).find('.guest-status').html(`
            New
        `)
        $('#chat-box .chat').append(`
            <li class="other">
                <div class="avatar"><img src="https://i.imgur.com/DY6gND0.png" draggable="false"/></div>
                <div class="msg">
                    <p>${data.content }</p>
                    <time>${data.updated_at }</time>
                </div>
            </li>
        `);
    });
    socket.on('server-send-agent-new-message', function(data) {
        $('#chat-box .chat').append(`
            <li class="self">
                <div class="avatar"><img src="https://i.imgur.com/HYcn9xO.png" draggable="false"/></div>
                <div class="msg">
                    <p>${data.content }</p>
                    <time>${data.updated_at }</time>
                </div>
            </li>
        `);
    });
    socket.on('server-send-new-guest', function(data) {
        console.log(data);
        $('#newchat_support table tbody').append(`
            <tr class="guest-user" id="${data._id}">
                <td>
                    ${data.name}
                </td>
                <td>
                    ${data.email}
                </td>
                <td class="guest-status"></td>
            </tr>
        `);
    });

    $(document).ready(function () {
        $(document).on('keyup', '#agent-message', function (e) {
            if(e.keyCode == 13)
            {
                let message = $(this).val();
                let user_id = $(this).data('user');
                let content = {
                    'message': message,
                    'user_id': user_id,
                    'agent_id': agent_id,
                    'type': 0
                };
                socket.emit('agent-new-message', content);
                $(this).val('');
            }
            
        });
    });
});