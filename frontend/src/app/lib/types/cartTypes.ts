import { ProductType,  } from "./productsContextType";

export interface CartItemOptions {
  quantity: number;
  totalPrice: number;
}

export interface CartItem {
  product: ProductType;
  options: CartItemOptions;
  id: string; 
  addedAt: string;
}