const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    firstName: String,
    userId: String,
    lastName: String,
    userName: { type: String, unique: true, required: true },
    gmail: { type: String, unique: true, required: true },
    phoneNo: String,
    password: String,
    isActivated: Boolean,
});

module.exports = mongoose.model('Register',registerSchema);