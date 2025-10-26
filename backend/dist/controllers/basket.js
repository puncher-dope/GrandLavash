"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBasket = deleteBasket;
const Basket_1 = require("../models/Basket");
async function deleteBasket(userId) {
    try {
        const deletedBasket = await Basket_1.Basket.deleteOne({ userId });
        if (deletedBasket.deletedCount === 0) {
            return { error: "Корзина не найдена" };
        }
        return { error: null };
    }
    catch (e) {
        return { error: e.message || "Неизвестная ошибка" };
    }
}
