
var mongodb = require('mongodb');

exports.up = function(db, next){
    db.createCollection('messages', {
        autoIndexId: true,
        room_id: String,
        user_id: String,
        sender_id: String,
        receive_id: String,
        type_id: String,
        content: String,
        status: Number,
        created_at: Date,
        updated_at: Date
    });
    next();
};

exports.down = function(db, next){
    db.messages.drop();
    next();
};
