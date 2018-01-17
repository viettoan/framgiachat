
var mongodb = require('mongodb');

exports.up = function(db, next){
    db.createCollection('types', {
        autoIndexId: true,
        name: String,
        description: String,
        created_at: Date,
        updated_at: Date
    });
    next();
};

exports.down = function(db, next){
    db.types.drop();
    next();
};
