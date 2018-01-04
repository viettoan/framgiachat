
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
        status: Number
    });
    next();
};

exports.down = function(db, next){
    db.users.drop();
    next();
};
