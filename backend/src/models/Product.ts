import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    categories: String,
    subcategories: String,
    description: String,
    price: Number,
    volume: String,
    image: String,
    available: { type: Boolean, default: true },
    addons: [
      {
        name: String,
        price: Number,
        required: Boolean,
        maxQuantity: { type: Number, default: 1 },
      },
    ],
    removableIngredients: [
      {
        name: String,
      },
    ],
  },
  { timestamps:true }
);

export const Product = mongoose.model("Product", ProductSchema);
