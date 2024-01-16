const mongoose = require('mongoose');

const masterUploadSchema = new mongoose.Schema({
    buffer: {
        type: Buffer,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    mimetype: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('MasterUpload',masterUploadSchema);