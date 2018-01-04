
var mongodb = require('mongodb');

exports.up = function(db, next){
    db.createCollection('rooms', {
        autoIndexId: true,
        agent_id: Number,
        customer_id: Number,
        status: Number
    });
    next();
};

exports.down = function(db, next){
    db.rooms.drop();
    next();
};
