var Customer = require('./app/Models/Customer');
var Message = require('./app/Models/Message');

module.exports = function(io) {
    io.on('connection', function(socket) {
        console.log(socket.id);
        socket.on('agent-online', function (data) {
            socket.join(data);
            socket.agent_id = data;
        });

        socket.on('guest-send-message', function (data) {
            Customer.findOne({ 'email': data.email }, function(err, customer) {
                if (err) {
                    return err;
                }
                if (!customer) {
                    return false;
                }
                var newMessage = new Message;
                newMessage.room_id = data.appId;
                newMessage.user_id = customer._id;
                newMessage.sender_id = customer._id;
                newMessage.receive_id = data.appId;
                newMessage.type_id = data.type;
                newMessage.content = data.message;
                newMessage.save(function(err) {
                    if (err) {
                        throw err;
                    }

                    return newMessage;
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
                    newCustomer.email = data.email;
                    newCustomer.name = data.name;
                    newCustomer.save(function(err) {
                        if (err) {
                            throw err;
                        }
                        return true;
                    });
                } 
            });
        });

    });
}