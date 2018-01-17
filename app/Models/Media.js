var mongoose = require('mongoose');
var schema = mongoose.Schema;

var mediaSchema = new schema({
    type_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('media', mediaSchema);