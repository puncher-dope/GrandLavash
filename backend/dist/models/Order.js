"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const OrderSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    items: [
        {
            productId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Product" },
            name: { type: String, required: true },
            price: { type: Number, required: true, min: 0 },
            quantity: { type: Number, required: true, min: 1 }
        },
    ],
    address: {
        street: String,
        flat: String,
        floor: String,
        doorphone: Number,
    },
    totalPrice: Number,
    status: {
        type: String,
        default: "pending",
    },
    paymentMethod: String,
}, { timestamps: true });
exports.Order = mongoose_1.default.model("Order", OrderSchema);
