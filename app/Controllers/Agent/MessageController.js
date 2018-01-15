var User = require('../../Models/User');
var Customer = require('../../Models/Customer');

class Message
{
    index(req, res)
    {
        Customer.find({}, function(err, customers) {
            if (err) {
                throw err;
            }
            res.render('agent/index', {'customers': customers});
        });
        
    }

}


module.exports = new Message();