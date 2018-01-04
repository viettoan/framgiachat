
var mongodb = require('mongodb');

exports.up = function(db, next){
    db.createCollection('media', {
        autoIndexId: true,
        media_id: Number,
        name: String,
        link: String
    });
    next();
};

exports.down = function(db, next){
    db.media.drop();
    next();
};
