
var mongodb = require('mongodb');

exports.up = function(db, next){
    db.createCollection('messages', {
        autoIndexId: true,
        room_id: Number,
        sender_id: Number,
        receive_id: Number,
        type_id: Number,
        content: String,
        status: Number
    });
    next();
};

exports.down = function(db, next){
    db.messages.drop();
    next();
};
