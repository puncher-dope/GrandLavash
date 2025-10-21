import mongoose from "mongoose"

const BasketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: { type: Number, min: 1, default: 1 },
        selectedAddons: [
          {
            addonId: mongoose.Schema.Types.ObjectId,
            quantity: { type: Number, default: 1 },
          },
        ],
        // Убранные ингредиенты
        removedIngredientIds: [mongoose.Schema.Types.ObjectId],
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    totalPrice: {
      // Добавляем реальное поле
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Basket = mongoose.model("Basket", BasketSchema);
