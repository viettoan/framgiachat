
var mongodb = require('mongodb');

exports.up = function(db, next){
    db.createCollection('rooms', {
        autoIndexId: true,
        agent_id: String,
        customer_id: String,
        status: Number,
        created_at: Date,
        updated_at: Date
    });
    next();
};

exports.down = function(db, next){
    db.rooms.drop();
    next();
};
