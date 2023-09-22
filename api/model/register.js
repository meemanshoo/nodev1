const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    firstName: String,
    userId: String,
    lastName: String,
    userName: String,
    gmail: String,
    phoneNo: String,
    password: String,
});

module.exports = mongoose.model('Register',registerSchema);