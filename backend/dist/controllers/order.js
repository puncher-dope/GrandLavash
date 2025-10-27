"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editOrder = editOrder;
const Order_1 = require("../models/Order");
async function editOrder(orderId, orderData) {
    try {
        const updateOrder = {
            status: orderData.status,
            paymentMethod: orderData.paymentMethod
        };
        Object.keys(updateOrder).forEach((key) => updateOrder[key] === undefined && delete updateOrder[key]);
        const updatedOrder = await Order_1.Order.findByIdAndUpdate(orderId, updateOrder, { new: true });
        if (!updatedOrder) {
            throw new Error("Заказ не найден");
        }
        return {
            error: null,
            order: updatedOrder
        };
    }
    catch (e) {
        return {
            error: e.message || 'Неизвестная ошибка'
        };
    }
}
