
var mongodb = require('mongodb');

exports.up = function(db, next){
    db.createCollection('rooms', {
        autoIndexId: true,
        agent_id: String,
        customer_id: String,
        status: Number
    });
    next();
};

exports.down = function(db, next){
    db.rooms.drop();
    next();
};
