var mongoose = require('mongoose');
var schema = mongoose.Schema;

var detailSchema = new schema({
    customer_id: {
        type: String,
        required: true
    },
    ip: String,
    browser: String,
    time: Date,
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('detail', detailSchema);