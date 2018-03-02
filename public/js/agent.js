$(document).ready(function() {
    socket.emit('agent-online', agent_id);
    socket.on('server-send-guest-new-message', function(data) {
        $('#newchat_support table tbody').find('#' + data.user_id).find('.guest-status').html(`
            New
        `)
        $('#chat-box .chat').append(`
            <li class="other">
                <div class="avatar"><img src="https://i.imgur.com/DY6gND0.png" draggable="false"/></div>
                <div class="msg">
                    ${(data.type_id == 0) ? `<img src="http://localhost:3000/images/${data.content }">`: `<p>${data.content }</p>`}
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
                    ${(data.type_id == 0) ? `<img src="http://localhost:3000/images/${data.content }">`: `<p>${data.content }</p>`}
                    <time>${data.updated_at }</time>
                </div>
            </li>
        `);
    });

    socket.on('server-send-new-guest', function(data) {
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

    socket.on('server-send-guest-online', function(data) {
        $('#customer_online table tbody').append(`
            <tr id="${data.id}" class="guest-online">
                <td>
                    ${data.ip}
                </td>
                <td>
                    ${data.time}
                </td>
                <td>
                    ${data.title}
                </td>
                <td class="guest-status"></td>
            </tr>
        `);
    });

    $(document).on('keyup', '#agent-message', function (e) {
        console.log(1);
        if(e.keyCode == 13)
        {
            let message = $(this).val();
            let user_id = $(this).data('user');
            let content = {
                'message': message,
                'user_id': user_id,
                'agent_id': agent_id,
                'type': 1
            };
            socket.emit('agent-new-message', content);
            $(this).val('');
        }
        
    });

    $(document).on('change', '#upload-file', function () {
        file = event.target.files[0] || event.dataTransfer.files[0];
        var reader = new FileReader();
        var  user_id = $(this).data('user');
        reader.onload = (e) => {
            var buffer = e.target.result;
            let content = {
                'user_id': user_id,
                'agent_id': agent_id,
                'message': file.name,
                'type': 0
            };
            socket.emit('agent-new-message-file', content, buffer);      
        };
        reader.readAsBinaryString(file);
    });
});