
import mongoose from "mongoose";

export type ObjectId = mongoose.Types.ObjectId;



// Вложенные интерфейсы для продукта
export interface ProductAddon {
  _id?: ObjectId;
  name: string;
  price: number;
  required: boolean;
  maxQuantity?: number;
}

export interface RemovableIngredient {
  _id?: ObjectId;
  name: string;
}

// Основной интерфейс продукта
export interface ProductData {
  _id?: ObjectId;
  name: string;
  categories: string;
  subcategories: string;
  description: string;
  price: number;
  volume: string;
  image: string;
  available?: boolean;
  addons?: ProductAddon[];
  removableIngredients?: RemovableIngredient[];
  createdAt?: Date;
  updatedAt?: Date;
}