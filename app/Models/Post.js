var mongoose = require('mongoose');
var schema = mongoose.Schema;

var postSchema = new schema({
    media_id: {
        type: String,
        required: true
    },
    title: {
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
    },
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('post', postSchema);