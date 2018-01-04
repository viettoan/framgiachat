
var mongodb = require('mongodb');

exports.up = function(db, next){
    db.createCollection('customers', {
        autoIndexId : true,
        email: String,
        name: String,
        status: Number
    });
    next();
};

exports.down = function(db, next){
    db.customers.drop();
    next();
};
