const mongoose = require('mongoose');

const validateIpSchema = new mongoose.Schema({
    ip: {
        type: String,
        unique: true,
        required: true,
    },
    appCheckId:{
        type: String,
        required: true,
    },
    isActivated:{
        type: Boolean,
        default: false
    },
    message:{
        type: String,
        default: "You are Blocked. Please contact to support team for further details"
    },
    lastCall: {
        type: [{ type: Date }],
    },
    uploadDate: {
        type: Date,
        default: Date.now()
    },
    updateDate: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('ValidateIp',validateIpSchema);