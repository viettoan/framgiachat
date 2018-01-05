var mongoose = require('mongoose');
var schema = mongoose.Schema;

var detailSchema = new schema({
    customer_id: {
        type: String,
        required: true
    },
    ip: String,
    browser: String,
    time: Date
});

module.exports = mongoose.model('detail', detailSchema);