const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productName: { type: String, required: true, unique: true },
    productType: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    additionalInformation: { type: String },
    imageDescription: { type: String },
    keywords: { type: String },
});


module.exports = mongoose.model('ProductSchema', ProductSchema);
