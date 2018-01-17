
var mongodb = require('mongodb');

exports.up = function(db, next){
    db.createCollection('media', {
        autoIndexId: true,
        type_id: String,
        name: String,
        link: String,
        created_at: Date,
        updated_at: Date
    });
    next();
};

exports.down = function(db, next){
    db.media.drop();
    next();
};
