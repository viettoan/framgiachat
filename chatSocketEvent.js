var Customer = require('./app/Models/Customer');
var Message = require('./app/Models/Message');
var date = require('date-and-time');

module.exports = function(io) {
    io.on('connection', function(socket) {
        socket.on('agent-online', function (data) {
            socket.join(data);
            socket.agent_id = data;
            console.log(socket.adapter.rooms);
        });

        socket.on('guest-send-message', function (data) {
            
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
                    for (i in sockets) {
                        if (sockets[i].agent_id == data.appId) {
                            socket.join(data.appId);
                            io.to(sockets[i].id).emit('server-send-guest-new-message', newMessage);
                        }
                    }
                    return true;
                });
            });
        });

        socket.on('guest-register', function (data) {
            Customer.findOne({ 'email': data.email }, function(err, customer) {
                if (err) {
                    return err;
                }
                if (!customer) {
                    var newCustomer = new Customer();
                    let now = new Date();
                    newCustomer.email = data.email;
                    newCustomer.name = data.name;
                    newCustomer.created_at = date.format(now, 'YYYY/MM/DD HH:mm:ss');
                    newCustomer.updated_at = date.format(now, 'YYYY/MM/DD HH:mm:ss');
                    newCustomer.save(function(err) {
                        if (err) {
                            throw err;
                        }
                        let sockets = io.sockets.sockets;
                        for (i in sockets) {
                            if (sockets[i].agent_id == data.appId) {
                                console.log(1);
                                socket.join(data.appId);
                                io.to(sockets[i].id).emit('server-send-new-guest', newCustomer);
                            }
                        }
                        return true;
                    });
                } 
            });
        });

    });
}