import jwt from "jsonwebtoken";
import { UserData } from "../types/userType";

export const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    )
  }
    export const  generateRefreshToken = (user) => {
    return jwt.sign(
      { id: user.id, role: user.role },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );
  }
  export const verifyRefreshToken = (token:string) => {
    return jwt.verify(token, process.env.REFRESH_SECRET);
  }
