const mongoose = require('mongoose');

const storeOtpSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    gmail: String,
    userId: String,
    status:Boolean,
    otp:String,
    attepts:Number,
    dateTime:Date
});

module.exports = mongoose.model('StoreOtp',storeOtpSchema);