import mongoose from "mongoose";

export type ObjectId = mongoose.Types.ObjectId;

// Базовые интерфейсы (только для данных, не для Mongoose документов)
export interface BasketAddon {
  addonId: ObjectId;
  quantity?: number;
  name?: string;
  price?: number;
}

export interface RemovedIngredient {
  _id: ObjectId;
  name?: string;
}

export interface BasketItem {
  productId: ObjectId;
  name?: string;
  price?: number;
  quantity: number;
  selectedAddons: BasketAddon[];
  removedIngredientIds: ObjectId[];
  updatedAt?: Date;
}

export interface BasketData {
  _id?: ObjectId;
  userId: ObjectId;
  items: BasketItem[];
  totalPrice?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Тип для обогащенных данных (после populate)
export interface EnrichedBasketItem extends Omit<BasketItem, 'selectedAddons' | 'removedIngredientIds'> {
  productName: string;
  productPrice: number;
  selectedAddons: Array<BasketAddon & { name: string; price: number }>;
  removedIngredients: Array<{ _id: ObjectId; name: string }>;
}

export interface EnrichedBasketData {
  _id?: ObjectId;
  userId: ObjectId;
  items: EnrichedBasketItem[];
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}