var mongoose = require('mongoose');
var schema = mongoose.Schema;
var objectId = schema.ObjectId;
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    email: String,
    password: String,
    phone: String,
    birthday: Date,
    gender: Number,
    address: String,
    role: Number
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', userSchema);