import mongoose from "mongoose";

// Базовые типы для идентификаторов
type ObjectId = mongoose.Types.ObjectId;

// Интерфейс для администратора
export interface AdminData {
  id?: ObjectId;
  login: string;
  password: string;
  role?: number;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}