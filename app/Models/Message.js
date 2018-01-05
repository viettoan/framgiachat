var mongoose = require('mongoose');
var schema = mongoose.Schema;

var messageSchema = new schema({
    room_id: {
        type: String,
        required: true
    },
    sender_id: {
        type: String,
        required: true
    },
    receive_id: {
        type: String,
        required: true
    },
    type_id: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('message', messageSchema);