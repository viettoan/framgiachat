var mongoose = require('mongoose');
var schema = mongoose.Schema;

var customerSchema = mongoose.Schema ({
    agent_id: {
        type: String,
        required: true
    },
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
    },
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('customer', customerSchema);