"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const Basket_1 = require("../models/Basket");
const Product_1 = require("../models/Product");
const basket_1 = require("../controllers/basket");
const userAuthenticated_1 = __importDefault(require("../middlewares/userAuthenticated"));
router.get("/", userAuthenticated_1.default, async (req, res) => {
    try {
        const basket = (await Basket_1.Basket.findOne({ userId: req.user.id }).populate({
            path: "items.productId",
            model: "Product",
        }));
        if (!basket) {
            return res.json({ items: [], totalPrice: 0 });
        }
        const enrichedItems = basket.items.map((item) => {
            const product = item.productId;
            return {
                productName: product.name,
                productPrice: product.price,
                quantity: item.quantity,
            };
        });
        res.json({
            items: enrichedItems,
            totalPrice: basket.totalPrice,
        });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
router.post("/", userAuthenticated_1.default, async (req, res) => {
    try {
        const { items } = req.body;
        const userId = req.user.id;
        const products = await Product_1.Product.find({
            _id: { $in: items.map((item) => item.productId) },
        });
        let totalPrice = 0;
        const validItems = [];
        for (const item of items) {
            const product = products.find((p) => p._id.equals(item.productId));
            if (!product)
                continue;
            const basePrice = product.price * item.quantity;
            totalPrice += basePrice;
            validItems.push({
                productId: product._id,
                quantity: item.quantity,
            });
        }
        await Basket_1.Basket.updateOne({ userId }, { $set: { items: validItems, totalPrice } }, { upsert: true });
        const populatedItems = validItems.map((item) => {
            const product = products.find((p) => p._id.equals(item.productId));
            return {
                ...item,
                productName: product.name,
                productPrice: product.price,
            };
        });
        res.json({
            message: "Корзина обновлена",
            items: populatedItems,
            totalPrice,
        });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
//удаление корзины
router.delete("/", userAuthenticated_1.default, async (req, res) => {
    const userId = req.user.id;
    const { error } = await (0, basket_1.deleteBasket)(userId);
    if (error) {
        return res.status(400).send({ error });
    }
    res.send({ message: "Товар удален" });
});
exports.default = router;
