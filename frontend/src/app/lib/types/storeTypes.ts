import { ProductType } from "./productsContextType";

export type UserT = {
  id: string;
  createdAt: string;
  login: string;
  phone: string;
  orders: ProductType[];
  role: number;
};

export type StoreStateT = {
  isLoading: boolean;
  error: string | null;
  user: UserT | null;
  products: ProductType[] | [];
  selectedProduct: null | ProductType;
  isEditing: boolean
  setIsEditing: (value: boolean) => void

  setSelectedProduct: (newProduct:ProductType | null) => void | null;
  fetchProducts: () => Promise<void> | [];
  login: (login: string, password: string) => Promise<void>;
};