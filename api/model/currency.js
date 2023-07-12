const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    coinName: String,
    coinImage: String,
    coinShortName: String,
    coinSymbol: String,
    coinPairWith: String,
    coinDecimalCurrency: String,
    coinListed: Boolean,
    coinDecimalPair: String,
    geckoVs_currency: String,
    geckoIds: String
});

module.exports = mongoose.model('Currency',currencySchema);