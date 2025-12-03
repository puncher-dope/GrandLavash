
import mongoose from "mongoose";

export type ObjectId = mongoose.Types.ObjectId;

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
  createdAt?: Date;
  updatedAt?: Date;
}