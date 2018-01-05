var mongodb = require('mongodb');

exports.up = function(db, next){
    db.createCollection('details', {
        autoIndexId: true,
        customer_id: String,
        ip_address: String,
        browser: String,
        time: Date
    });
    next();
};

exports.down = function(db, next){
    db.details.drop();
    next();
};
