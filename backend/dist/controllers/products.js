"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = getAllProducts;
exports.getProductById = getProductById;
exports.editProduct = editProduct;
exports.deleteProduct = deleteProduct;
const Product_1 = require("../models/Product");
//get all
async function getAllProducts() {
    try {
        const products = await Product_1.Product.find();
        if (!products) {
            throw new Error('Товары не найдены');
        }
        return {
            error: null,
            products
        };
    }
    catch (e) {
        return { error: e.message || "Неизвестная ошибка" };
    }
}
//get by ID
async function getProductById(productId) {
    try {
        const product = await Product_1.Product.findById(productId);
        if (!product) {
            throw new Error('Товар не найден');
        }
        return {
            error: null,
            product
        };
    }
    catch (e) {
        return {
            error: e.message || "Неизвестная ошибка"
        };
    }
}
async function editProduct(productId, productData) {
    try {
        const product = await Product_1.Product.findById(productId);
        if (!product) {
            return { error: "Товар не найден" };
        }
        const updateData = {
            name: productData.name ?? product.name,
            categories: productData.categories ?? product.categories,
            subcategories: productData.subcategories ?? product.subcategories,
            price: productData.price ?? product.price,
            volume: productData.volume ?? product.volume,
            description: productData.description ?? product.description,
            image: productData.image ?? product.image
        };
        const updatedProduct = await Product_1.Product.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });
        return { error: null, product: updatedProduct };
    }
    catch (e) {
        return { error: e.message || "Неизвестная ошибка" };
    }
}
async function deleteProduct(productId) {
    try {
        const deletedProduct = await Product_1.Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return { error: "Товар не найден" };
        }
        return { error: null, product: deleteProduct };
    }
    catch (e) {
        return { error: e.message || "Неизвестная ошибка" };
    }
}
