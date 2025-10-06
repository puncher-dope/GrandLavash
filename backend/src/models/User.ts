import mongoose from "mongoose";
import { roles } from "../constants/roles";

const UserSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: Number,
      default: roles.USER,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    refreshToken: String,
  },
  { timestamps:true }
);

export const User = mongoose.model("User", UserSchema);
