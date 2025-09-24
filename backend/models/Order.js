const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        selectedAddons: [
          {
            addonId: mongoose.Schema.Types.ObjectId,
            name: String,
            price: Number,
            quantity: { type: Number, default: 1 },
          },
        ],
        removedIngredients: [
          {
            _id: mongoose.Schema.Types.ObjectId,
            name: String,
          },
        ],
        comment: String,
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
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
