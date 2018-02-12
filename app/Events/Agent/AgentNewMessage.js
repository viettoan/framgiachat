var Message = require('../../Models/Message');
var date = require('date-and-time');

class AgentNewMessage
{
    store(data, io, socket)
    {
        let now = new Date();
        var newMessage = new Message;
        newMessage.room_id = data.agent_id;
        newMessage.user_id = data.user_id;
        newMessage.sender_id = data.agent_id;
        newMessage.receive_id = data.user_id;
        newMessage.type_id = data.type;
        newMessage.content = data.message;
        newMessage.created_at = date.format(now, 'YYYY/MM/DD HH:mm:ss');
        newMessage.updated_at = date.format(now, 'YYYY/MM/DD HH:mm:ss');
        newMessage.save(function(err) {
            if (err) {
                throw err;
            }
            let sockets = io.sockets.sockets;
            let customerRoom = '';
            for (let i in sockets) {
                if (sockets[i].agent_id == data.agent_id) {
                    io.to(sockets[i].id).emit('server-send-agent-new-message', newMessage);
                }
                for (let r in socket.adapter.rooms) {
                    
                    if (r == data.user_id) {
                        customerRoom = r;
                    }
                }
            }
            io.sockets.in(customerRoom).emit('serverSendAgentNewMessage', newMessage);
            return true;
        });
        
    }

}


module.exports = new AgentNewMessage();