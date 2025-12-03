"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router({ mergeParams: true });
const Basket_1 = require("../models/Basket");
const User_1 = require("../models/User");
const Order_1 = require("../models/Order");
const notificationBot_1 = require("../telegram/notificationBot");
const order_1 = require("../controllers/order");
const userAuthenticated_1 = __importDefault(require("../middlewares/userAuthenticated"));
// Получение всех заказов
router.get("/", userAuthenticated_1.default, async (req, res) => {
    try {
        const orders = await Order_1.Order.find({ userId: req.user.id });
        res.json(orders);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
// Получение одного заказа
router.get("/:id", userAuthenticated_1.default, async (req, res) => {
    try {
        const order = await Order_1.Order.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });
        if (!order) {
            return res.status(404).json({ error: "Заказ не найден" });
        }
        res.json(order);
    }
    catch (e) {
        return res.status(400).json({ error: "Заказ не найден" });
    }
});
//редактирование заказа
router.patch("/:id", userAuthenticated_1.default, async (req, res) => {
    try {
        const { error } = await (0, order_1.editOrder)(req.params.id, req.body);
        if (error) {
            return res.status(400).json({ error });
        }
        res.status(200).json("Статус заказа успешно обновлен");
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
// Создание заказа
router.post("/", userAuthenticated_1.default, async (req, res) => {
    try {
        const userId = req.user.id;
        const { address, paymentMethod, phone } = req.body;
        const basket = await Basket_1.Basket.findOne({ userId }).populate({
            path: "items.productId",
            model: "Product",
        });
        if (!basket?.items?.length) {
            return res.status(400).json("Корзина пуста");
        }
        const orderItems = basket.items.map((item) => {
            const product = item.productId;
            const addons = item.selectedAddons.map((addon) => {
                const productAddon = product.addons.find((a) => a._id.equals(addon.addonId));
                return {
                    addonId: productAddon._id,
                    name: productAddon.name,
                    price: productAddon.price,
                    quantity: addon.quantity,
                };
            });
            const removedIngredients = item.removedIngredientIds.map((id) => {
                const ing = product.removableIngredients.find((ri) => ri._id.equals(id));
                return {
                    _id: ing._id,
                    name: ing.name || 'Неизвестный ингредиент',
                };
            });
            return {
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                selectedAddons: addons,
                removedIngredients: removedIngredients,
            };
        });
        const totalPrice = orderItems.reduce((sum, item) => {
            const base = item.price * item.quantity;
            const addonsSum = item.selectedAddons.reduce((s, a) => s + a.price * a.quantity, 0);
            return sum + base + addonsSum;
        }, 0);
        const orderData = {
            userId,
            items: orderItems,
            address: address || {},
            paymentMethod: paymentMethod || "card", 
            totalPrice,
            status: "pending",
        };
        // Добавляем phone только если он есть
        if (phone) {
            orderData.phone = phone;
        }
        const order = await Order_1.Order.create(orderData);
        await (0, notificationBot_1.sendOrderNotification)(order);
        await User_1.User.findByIdAndUpdate(userId, { $push: { orders: order._id } });
        // Очищаем корзину
        await Basket_1.Basket.deleteOne({ userId });
        res.status(201).json(order);
    }
    catch (e) {
        console.error('❌ Error creating order:', e);
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
