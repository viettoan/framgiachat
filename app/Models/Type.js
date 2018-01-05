var mongoose = require('mongoose');
var schema = mongoose.Schema;

var typeSchema = new schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('type', typeSchema);