
var mongodb = require('mongodb');

exports.up = function(db, next){
    db.createCollection('customers', {
        autoIndexId : true,
        agent_id: String,
        email: String,
        name: String,
        status: Number,
        created_at: Date,
        updated_at: Date
    });
    next();
};

exports.down = function(db, next){
    db.customers.drop();
    next();
};
