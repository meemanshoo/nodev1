const mongoose = require('mongoose');

const masterUserSchema = new mongoose.Schema({
    gmail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    pin: {
        type: String,
        required: true,
        unique: true
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('MasterUsers',masterUserSchema);