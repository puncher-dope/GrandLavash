
export interface OrderItem {
  _id: string;
  name: string;
  price: number;
  productId: string;
  quantity: number;
}

export interface Address {
  doorphone: number;
  flat: string;
  floor: string;
  street: string;
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed", 
  CANCELLED = "cancelled"
}

export enum PaymentMethod {
  CARD = "card",
  CASH = "cash"
}

export interface Order {
  _id: string;
  address: Address;
  createdAt: string; 
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  totalPrice: number;
  updatedAt: string; 
  userId: string;
  __v: number;
}

export interface OrderApiResponse {
  data: Order;
  error: null | string;
}