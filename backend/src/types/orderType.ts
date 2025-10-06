import mongoose from "mongoose";


// Базовые типы для идентификаторов
export type ObjectId = mongoose.Types.ObjectId;

// Вложенные интерфейсы для составных частей
export interface OrderAddon {
  addonId: ObjectId;
  name: string;
  price: number;
  quantity?: number;
}

export interface RemovedIngredient {
  _id: ObjectId;
  name: string;
}

export interface OrderItem {
  productId: ObjectId;
  name: string;
  price: number;
  quantity: number;
  selectedAddons?: OrderAddon[];
  removedIngredients?: RemovedIngredient[];
  comment?: string;
}

export interface DeliveryAddress {
  street: string;
  flat: string;
  floor?: string;
  doorphone: number;
}

// Основной интерфейс заказа
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