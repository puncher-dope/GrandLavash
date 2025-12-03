import mongoose from "mongoose";

type ObjectId = mongoose.Types.ObjectId;
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