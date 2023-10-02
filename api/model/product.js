const { Int32, Double, Decimal128 } = require('mongodb');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    categoryId: {
        type: String,
        ref: 'Category', // Reference to the Category model
      },
    productid:String,
    image: String,
    name: String,
    rates: Number,
    noOfRatings: Number,
    noOfViews: Number,
    shortDesc: String,
    price: Number,
    offPer: Number,
    isAssured: Boolean,
    stock:Number,
    isActivated:Boolean,
});

module.exports = mongoose.model('Product',productSchema);