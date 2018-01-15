var mongoose = require('mongoose');
var schema = mongoose.Schema;

var customerSchema = mongoose.Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('customer', customerSchema);