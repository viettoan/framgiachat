var Customer = require('./app/Models/Customer');
var Message = require('./app/Models/Message');

module.exports = function(io) {
    io.on('connection', function(socket) {
        socket.on('guest-send-message', function (data) {
            Customer.findOne({ 'email': data.email }, function(err, customer) {
                var customer_id = '';
                if (err) {
                    console.log(err);
                    return err;
                }
                if (customer) {
                    customer_id = customer._id;
                } else {
                    var newCustomer = new Customer();
                    newCustomer.email = data.email;
                    newCustomer.name = data.name;
                    newCustomer.save(function(err) {
                        if (err) {
                            throw err;
                        }

                        customer_id = newCustomer._id;
                    });
                }

                var newMessage = new Message;
                newMessage.room_id = socket.id;
                newMessage.sender_id = customer_id;
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
        })
    });
}