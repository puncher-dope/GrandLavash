const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
    name: String,
    categories: String,
    subcategories: String,
    description : String,
    price: Number,
    volume: String,
    image: String,
    available: {type: Boolean, default: true},
    addons:[{
        name: String,
        price: Number,
        required:Boolean,
        maxQuantity: { type: Number, default: 1 }
    }],
     removableIngredients: [{
        name: String
    }]
}, {timestamp: true})

const Product = mongoose.model('Product', ProductSchema)
module.exports = Product