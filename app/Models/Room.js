var mongoose = require('mongoose');
var schema = mongoose.Schema;

var roomSchema = new schema({
    agent_id: {
        type: String,
        required: true
    },
    customer_id: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: true
    },
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('room', roomSchema);