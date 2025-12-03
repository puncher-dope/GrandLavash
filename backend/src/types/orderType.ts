import mongoose from "mongoose";


export type ObjectId = mongoose.Types.ObjectId;

export interface OrderItem {
  productId: ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface DeliveryAddress {
  street: string;
  flat: string;
  floor?: string;
  doorphone: number;
}

export interface OrderData {
  userId: ObjectId;
  items: OrderItem[];
  address: DeliveryAddress;
  totalPrice: number;
  status?: string;
  paymentMethod: string;
  createdAt?: Date;
  updatedAt?: Date;
}