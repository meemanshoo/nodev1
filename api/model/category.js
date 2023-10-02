const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    categoryId: String,
    categoryImage: String,
    categoryName: String,
    categoryStatus: Boolean,
});

module.exports = mongoose.model('Category',categorySchema);