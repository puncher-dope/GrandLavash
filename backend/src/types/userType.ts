import mongoose from "mongoose";

type ObjectId = mongoose.Types.ObjectId;
// Интерфейс для пользователя
export interface UserData {
  id?: ObjectId;
  login: string;
  phone: string;
  role?: number;
  orders: ObjectId[];
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}