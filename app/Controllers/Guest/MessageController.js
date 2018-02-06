var User = require('../../Models/User');
var Customer = require('../../Models/Customer');
var Message = require('../../Models/Message');

class MessageController
{
    index(req, res)
    {
        Customer.findOne({'email': req.query.email}, function(err, customer) {
            if (err) {
                throw err;
            }
            Message.find({'room_id': req.query.room_id, 'user_id': customer._id}, function(err, messages) {
                if (err) {
                    throw err;
                }
                res.json({messages: messages});
            });
        });
        
    }

    store(req, res)
    {
        res.json(req.query.data);
    }
}


module.exports = new MessageController();