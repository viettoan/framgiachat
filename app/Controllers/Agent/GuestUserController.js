var User = require('../../Models/User');
var Customer = require('../../Models/Customer');

class GuestUserController
{
    index(req, res)
    {
        Customer.find({}, function(err, customers) {
            if (err) {
                throw err;
            }
            res.render('agent/index', {'customers': customers, 'agent': req.user});
        });
        
    }

}


module.exports = new GuestUserController();