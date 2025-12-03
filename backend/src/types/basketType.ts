import mongoose from "mongoose";

export type ObjectId = mongoose.Types.ObjectId;

export interface RemovedIngredient {
  _id: ObjectId;
  name?: string;
}

export interface BasketItem {
  productId: ObjectId;
  name?: string;
  price?: number;
  quantity: number;
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

export interface EnrichedBasketItem  {
  productName: string;
  productPrice: number;
}

export interface EnrichedBasketData {
  _id?: ObjectId;
  userId: ObjectId;
  items: EnrichedBasketItem[];
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}