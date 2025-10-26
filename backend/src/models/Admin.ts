import mongoose from "mongoose";
import { roles } from "../constants/roles";

const AdminSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    refreshToken: String,
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", AdminSchema);