import { Request } from "express";
import { AdminData } from "./adminType";
import { UserData } from "./userType";

export interface AuthRequest extends Request {
  admin?: AdminData
  user?: UserData
}
