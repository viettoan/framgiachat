
var mongodb = require('mongodb');

exports.up = function(db, next){
    db.createCollection('users', {
        autoIndexId : true,
        email: String,
        password: String,
        phone: String,
        birthday: Date,
        gender: Number,
        address: String,
        role: Number,
        status: Number,
        created_at: Date,
        updated_at: Date
    });
    next();
};

exports.down = function(db, next){
    db.users.drop();
    next();
};
