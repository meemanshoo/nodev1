const mongoose = require('mongoose');

const appCheckSchema = new mongoose.Schema({
    appName: {
        type: String,
        required: true,
        unique: true
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    message: {
        type: String,
        default: "App is currently blocked. Please contact to support team for further details"
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

module.exports = mongoose.model('AppCheck',appCheckSchema);