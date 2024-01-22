const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    color: {
        type: String,
        required: true,
    },
    number:{
        type: Number,
        required: true,
    },
    size:{
        type: String,
        required: true,
    },
    period:{
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('Game',gameSchema);