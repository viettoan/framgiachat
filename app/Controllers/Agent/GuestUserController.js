var User = require('../../Models/User');
var Customer = require('../../Models/Customer');

class GuestUserController
{
    index(req, res)
    {
        Customer.find({'agent_id': req.user._id}, function(err, customers) {
            if (err) {
                throw err;
            }
            res.render('agent/index', {'customers': customers, 'agent': req.user});
        });
        
    }

}


module.exports = new GuestUserController();