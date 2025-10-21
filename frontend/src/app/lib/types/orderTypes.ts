// Интерфейсы для ингредиентов и аддонов
export interface RemovedIngredient {
  _id: string;
  name: string;
}

export interface SelectedAddon {
  addonId: string;
  name: string;
  price: number;
  quantity: number;
  _id: string;
}

// Интерфейс для элемента заказа
export interface OrderItem {
  _id: string;
  name: string;
  price: number;
  productId: string;
  quantity: number;
  removedIngredients: RemovedIngredient[];
  selectedAddons: SelectedAddon[];
}

// Интерфейс для адреса
export interface Address {
  doorphone: number;
  flat: string;
  floor: string;
  street: string;
}

// Enum для статусов заказа
export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed", 
  CANCELLED = "cancelled"
}

// Enum для методов оплаты
export enum PaymentMethod {
  CARD = "card",
  CASH = "cash"
}

// Основной интерфейс заказа
export interface Order {
  _id: string;
  address: Address;
  createdAt: string; // или Date
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  totalPrice: number;
  updatedAt: string; // или Date
  userId: string;
  __v: number;
}

// Интерфейс ответа API
export interface OrderApiResponse {
  data: Order;
  error: null | string;
}