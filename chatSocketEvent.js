var Customer = require('./app/Models/Customer');
var Message = require('./app/Models/Message');
var date = require('date-and-time');

module.exports = function(io) {
    io.on('connection', function(socket) {
        socket.on('agent-online', function (data) {
            socket.join(data);
            socket.agent_id = data;
        });

        socket.on('agent-new-message', function (data) {
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
                for (i in sockets) {
                    if (sockets[i].agent_id == data.agent_id) {
                        io.to(sockets[i].id).emit('server-send-agent-new-message', newMessage);
                    }
                    for (r in socket.adapter.rooms) {
                        
                        if (r == data.user_id) {
                            customerRoom = r;
                        }
                    }
                }
                io.sockets.in(r).emit('serverSendAgentNewMessage', newMessage);
                return true;
            });
        });
        socket.on('agent-new-message-file', function (data, image, buffer) {
            var fs = require('fs');
            var fileName = __dirname + '/public/images/' + image;
    
            fs.open(fileName, 'a', 0755, function(err, fd) {
                if (err) throw err;
    
                fs.write(fd, buffer, null, 'Binary', function(err, written, buff) {
                    fs.close(fd, function() {
                        let now = new Date();
                        var newMessage = new Message;
                        newMessage.room_id = data.agent_id;
                        newMessage.user_id = data.user_id;
                        newMessage.sender_id = data.agent_id;
                        newMessage.receive_id = data.user_id;
                        newMessage.type_id = data.type;
                        newMessage.content = image;
                        newMessage.created_at = date.format(now, 'YYYY/MM/DD HH:mm:ss');
                        newMessage.updated_at = date.format(now, 'YYYY/MM/DD HH:mm:ss');
                        newMessage.save(function(err) {
                            if (err) {
                                throw err;
                            }
                            let sockets = io.sockets.sockets;
                            let customerRoom = '';
                            for (i in sockets) {
                                if (sockets[i].agent_id == data.agent_id) {
                                    io.to(sockets[i].id).emit('server-send-agent-new-message-file', newMessage);
                                }
                                for (r in socket.adapter.rooms) {
                                    
                                    if (r == data.user_id) {
                                        customerRoom = r;
                                    }
                                }
                            }
                            io.sockets.in(r).emit('serverSendAgentNewMessageFile', newMessage);
                            return true;
                        });
                    });
                })
            });
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
                            console.log(1);
                            io.to(sockets[i].id).emit('server-send-guest-new-message', newMessage);
                        }
                    }
                    io.to(socket.id).emit('serverSendGuestNewMessage', newMessage);
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
                        for (i in sockets) {
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
        });

        socket.on('guest-send-message-file', function (data, image, buffer) {
            var fs = require('fs');
            var fileName = __dirname + '/public/images/' + image;
    
            fs.open(fileName, 'a', 0755, function(err, fd) {
                if (err) throw err;
    
                fs.write(fd, buffer, null, 'Binary', function(err, written, buff) {
                    fs.close(fd, function() {
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
                            newMessage.content = image;
                            newMessage.created_at = date.format(now, 'YYYY/MM/DD HH:mm:ss');
                            newMessage.updated_at = date.format(now, 'YYYY/MM/DD HH:mm:ss');
                            newMessage.save(function(err) {
                                if (err) {
                                    throw err;
                                }
                                let sockets = io.sockets.sockets;
                                for (i in sockets) {
                                    if (sockets[i].agent_id == data.appId) {
                                        io.to(sockets[i].id).emit('server-send-guest-new-message-file', newMessage);
                                    }
                                }
                                io.to(socket.id).emit('serverSendGuestNewMessageFile', newMessage);
                                return true;
                            });
                        });
                    });
                })
            });
        });
    });
}