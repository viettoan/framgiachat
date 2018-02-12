var Customer = require('../../Models/Customer');
var date = require('date-and-time');

class GuestRegister
{
    store(data, io, socket)
    {
        Customer.findOne({ 'email': data.email }, function(err, customer) {
            if (err) {
                return err;
            }
            if (!customer) {
                var newCustomer = new Customer();
                let now = new Date();
                newCustomer.agent_id = data.appId;
                newCustomer.email = data.email;
                newCustomer.name = data.name;
                newCustomer.created_at = date.format(now, 'YYYY/MM/DD HH:mm:ss');
                newCustomer.updated_at = date.format(now, 'YYYY/MM/DD HH:mm:ss');
                newCustomer.save(function(err) {
                    if (err) {
                        throw err;
                    }
                    let sockets = io.sockets.sockets;
                    for (let i in sockets) {
                        if (sockets[i].agent_id == data.appId) {
                            socket.join(data.appId);
                            socket.join(newCustomer._id);
                            io.to(sockets[i].id).emit('server-send-new-guest', newCustomer);
                        }
                    }
                    return true;
                });
            } else {
                socket.join(data.appId);
                socket.join(customer._id);
            } 
        });
    }

}


module.exports = new GuestRegister();