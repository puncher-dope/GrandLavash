import mongoose from "mongoose";

type ObjectId = mongoose.Types.ObjectId;

export interface AdminData {
  id?: ObjectId;
  login: string;
  password: string;
  role?: number;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}