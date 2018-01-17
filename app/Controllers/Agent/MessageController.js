var User = require('../../Models/User');
var Customer = require('../../Models/Customer');
var Message = require('../../Models/Message');

class MessageController
{
    index(req, res)
    {
        Message.find({'room_id': req.user._id, 'user_id': req.query.id}, function(err, messages) {
            if (err) {
                throw err;
            }
            res.json({messages: messages, agent_id: req.user._id});
        });
        
    }

}


module.exports = new MessageController();