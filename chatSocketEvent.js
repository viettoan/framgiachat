var agentNewMessage = require('./app/Events/Agent/AgentNewMessage.js');
var guestNewMessage = require('./app/Events/Guest/GuestNewMessage.js');
var guestRegister = require('./app/Events/Guest/GuestRegister.js');

module.exports = function(io) {
    io.on('connection', function(socket) {
        socket.on('agent-online', function (data) {
            socket.join(data);
            socket.agent_id = data;
        });

        socket.on('agent-new-message', (data) => {
            agentNewMessage.store(data, io, socket);
        });

        socket.on('agent-new-message-file', function (data, buffer) {
            var fs = require('fs');
            var fileName = __dirname + '/public/images/' + data.message;
    
            fs.open(fileName, 'a', 0755, function(err, fd) {
                if (err) throw err;
    
                fs.write(fd, buffer, null, 'Binary', function(err, written, buff) {
                    fs.close(fd, function() {
                        agentNewMessage.store(data, io, socket);
                    });
                })
            });
        });

        socket.on('guest-send-message', function (data) {
            guestNewMessage.store(data, io, socket);
        });

        socket.on('guest-register', function (data) {
            guestRegister.store(data, io, socket);
        });

        socket.on('guest-send-message-file', function (data, buffer) {
            var fs = require('fs');
            var fileName = __dirname + '/public/images/' + data.message;
    
            fs.open(fileName, 'a', 0755, function(err, fd) {
                if (err) throw err;
    
                fs.write(fd, buffer, null, 'Binary', function(err, written, buff) {
                    fs.close(fd, function() {
                        guestNewMessage.store(data, io, socket);
                    });
                })
            });
        });
    });
}