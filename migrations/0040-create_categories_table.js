
var mongodb = require('mongodb');

exports.up = function(db, next){
    db.createCollection('categories', {
        autoIndexId: true,
        type_id: String,
        name: String,
        description: String,
        status: Number,
        created_at: Date,
        updated_at: Date
    })
    next();
};

exports.down = function(db, next){
    db.categories.drop();
    next();
};
