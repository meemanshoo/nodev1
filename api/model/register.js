const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    userName: String,
    gmail: String,
    phoneNo: String,
    passsword: String,
});

module.exports = mongoose.model('Register',registerSchema);