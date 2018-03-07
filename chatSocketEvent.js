var agentNewMessage = require('./app/Events/Agent/AgentNewMessage.js');
var guestNewMessage = require('./app/Events/Guest/GuestNewMessage.js');
var guestRegister = require('./app/Events/Guest/GuestRegister.js');
var date = require('date-and-time');

module.exports = function(io) {
    var guests = [];
    io.on('connection', function(socket) {
        socket.on('agent-online', function (data) {
            socket.join(data);
            socket.agent_id = data;
        });

        socket.on('guest-online', function (data) {
            var headers_cookie =  socket.request.headers.cookie;
            var sid = headers_cookie.split(';')[0];
            if (sid.split('=')[0] == 'io') {
                sid = headers_cookie.split(';')[1];
                sid = sid.split('=')[1];
            } else {
                sid = sid.split('=')[1];
            }
            console.log(guests);
            if (guests.indexOf(sid) < 0) {
                data['id'] = socket.id;
                data['ip'] = socket.request.connection.remoteAddress;
                let sockets = io.sockets.sockets;
                for (let i in sockets) {
                    if (sockets[i].agent_id == data.appId) {
                        io.to(sockets[i].id).emit('server-send-guest-online', data);
                    }
                }
                guests.push(sid);
                socket.appId = data.appId;
            }
            
        });

        socket.on('disconnect', function () {
            var headers_cookie =  socket.request.headers.cookie;
            var sid = headers_cookie.split(';')[0];
    
            if (sid.split('=')[0] == 'io') {
                sid = headers_cookie.split(';')[1];
                sid = sid.split('=')[1];
            } else {
                sid = sid.split('=')[1];
            }
    
            if (guests.indexOf(sid) >= 0) {
                guests.splice(sid, 1);
                io.to(socket.appId).emit('server-send-guest-offline', socket.id);
            }
        });

        socket.on('agent-new-message', (data) => {
            agentNewMessage.store(data, io, socket);
        });

        socket.on('agent-new-message-guest', (data) => {
            let now = new Date();
            data.updated_at = date.format(now, 'YYYY/MM/DD HH:mm:ss');
            io.to(data.agent_id).emit('server-send-agent-new-message-guest', data);
            io.to(data.guest_id).emit('serverSendAgentNewMessageGuest', data);
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

        socket.on('guest-send-message-file', function (data, file, buffer) {
            var fs = require('fs');
            var fileName = __dirname + '/public/images/' + file;
            data.message = file;
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