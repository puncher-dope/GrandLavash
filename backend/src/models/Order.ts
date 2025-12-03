import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
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
  },
  { timestamps: true }
);
export const Order = mongoose.model("Order", OrderSchema)
