const mongoose = require("mongoose");

const productschema = new mongoose.Schema({
    prodName: {
        type: String,
        required: [true, 'name must be a string']
    },
    prodPrice: {
        type: String,
        required: [true, 'price type must be a number']
    },
    prodSnippet: {
        type: String,
        required: [true, 'expects a string type']
    },
    prodDetails: {
        type: String,
        required: [true, 'expects a string type']
    },
    prodImg_url: {
        type: String,
        required: [true, 'expects a string type']
    },
    prodImg_id: {
        type: String,
        required: [true, 'expects a string type']
    },
    prodLikes: {
        type: Number,
        required: false
    }
}, {timestamps: true});

const product = new mongoose.model("product", productschema);

module.exports = {product};