var mongoose = require('mongoose');
var schema = mongoose.Schema;

var typeSchema = new schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('type', typeSchema);