
var mongodb = require('mongodb');

exports.up = function(db, next){
    db.createCollection('posts', {
        autoIndexId: true,
        media_id: String,
        title: String,
        content: String,
        status: Number,
        created_at: Date,
        updated_at: Date
    });
    next();
};

exports.down = function(db, next){
    db.posts.drop();
    next();
};
