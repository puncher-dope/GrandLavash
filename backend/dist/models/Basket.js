"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Basket = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const BasketSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    items: [
        {
            productId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            name: String,
            price: Number,
            quantity: { type: Number, min: 1, default: 1 },
            updatedAt: { type: Date, default: Date.now },
        },
    ],
    totalPrice: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
exports.Basket = mongoose_1.default.model("Basket", BasketSchema);
