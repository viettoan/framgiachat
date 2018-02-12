var Message = require('../../Models/Message');
var Customer = require('../../Models/Customer');
var date = require('date-and-time');

class GuestNewMessage
{
    store(data, io, socket)
    {
        Customer.findOne({ 'email': data.email }, function(err, customer) {
            if (err) {
                return err;
            }
            if (!customer) {
                return false;
            }
            let now = new Date();
            var newMessage = new Message;
            newMessage.room_id = data.appId;
            newMessage.user_id = customer._id;
            newMessage.sender_id = customer._id;
            newMessage.receive_id = data.appId;
            newMessage.type_id = data.type;
            newMessage.content = data.message;
            newMessage.created_at = date.format(now, 'YYYY/MM/DD HH:mm:ss');
            newMessage.updated_at = date.format(now, 'YYYY/MM/DD HH:mm:ss');
            newMessage.save(function(err) {
                if (err) {
                    throw err;
                }
                let sockets = io.sockets.sockets;
                for (let i in sockets) {
                    if (sockets[i].agent_id == data.appId) {
                        io.to(sockets[i].id).emit('server-send-guest-new-message', newMessage);
                    }
                }
                io.to(socket.id).emit('serverSendGuestNewMessage', newMessage);
                return true;
            });
        });  
    }

}


module.exports = new GuestNewMessage();