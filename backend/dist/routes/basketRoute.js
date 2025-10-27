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
//Посмотреть корзину
router.get("/", userAuthenticated_1.default, async (req, res) => {
    try {
        const basket = (await Basket_1.Basket.findOne({ userId: req.user.id }).populate({
            path: "items.productId",
            model: "Product",
        }));
        if (!basket) {
            return res.json({ items: [], totalPrice: 0 });
        }
        // Формируем ответ с полными данными о допах
        const enrichedItems = basket.items.map((item) => {
            const product = item.productId;
            const enrichedAddons = item.selectedAddons.map((addon) => {
                const productAddon = product.addons.find((a) => a._id.equals(addon.addonId));
                return {
                    addonId: addon.addonId,
                    quantity: addon.quantity,
                    name: productAddon?.name || "Неизвестный доп",
                    price: productAddon?.price || 0,
                };
            });
            const removeAddons = item.removedIngredientIds.map((id) => {
                const productRemoveIngredient = product.removableIngredients.find((a) => a._id.equals(id));
                return {
                    ...productRemoveIngredient.toObject(),
                    name: productRemoveIngredient?.name || "Неизвестный доп",
                };
            });
            return {
                // ...item.toObject(),
                productName: product.name,
                productPrice: product.price,
                quantity: item.quantity,
                selectedAddons: enrichedAddons,
                removedIngredientIds: removeAddons,
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
// Добавление/обновление корзины
router.post("/", userAuthenticated_1.default, async (req, res) => {
    try {
        const { items } = req.body;
        const userId = req.user.id;
        // Получаем полные данные товаров с их допами
        const products = await Product_1.Product.find({
            _id: { $in: items.map((item) => item.productId) },
        });
        let totalPrice = 0;
        const validItems = [];
        for (const item of items) {
            const product = products.find((p) => p._id.equals(item.productId));
            if (!product)
                continue;
            // Валидация дополнений
            const validatedAddons = [];
            for (const addon of item.selectedAddons || []) {
                const productAddon = product.addons.find((a) => a._id.equals(addon.addonId));
                if (productAddon) {
                    validatedAddons.push({
                        addonId: productAddon._id,
                        quantity: addon.quantity,
                    });
                }
            }
            // Валидация убранных ингредиентов
            const validatedRemoved = (item.removedIngredientIds || []).filter((id) => product.removableIngredients.some((ri) => ri._id.equals(id)));
            // Расчет стоимости
            const basePrice = product.price * item.quantity;
            const addonsPrice = validatedAddons.reduce((sum, addon) => {
                const productAddon = product.addons.find((a) => a._id.equals(addon.addonId));
                return sum + productAddon.price * addon.quantity;
            }, 0);
            totalPrice += basePrice + addonsPrice;
            validItems.push({
                productId: product._id,
                quantity: item.quantity,
                selectedAddons: validatedAddons,
                removedIngredientIds: validatedRemoved,
            });
        }
        await Basket_1.Basket.updateOne({ userId }, { $set: { items: validItems, totalPrice } }, { upsert: true });
        // Для клиента возвращаем полные данные
        const populatedItems = validItems.map((item) => {
            const product = products.find((p) => p._id.equals(item.productId));
            return {
                ...item,
                productName: product.name,
                productPrice: product.price,
                // Можно добавить другие нужные поля
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
