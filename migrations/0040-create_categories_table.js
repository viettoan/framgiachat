
var mongodb = require('mongodb');

exports.up = function(db, next){
    db.createCollection('categories', {
        autoIndexId: true,
        type_id: Number,
        name: String,
        description: String,
        status: Number
    })
    next();
};

exports.down = function(db, next){
    db.categories.drop();
    next();
};
