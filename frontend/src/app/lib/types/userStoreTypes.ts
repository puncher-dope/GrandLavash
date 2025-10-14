import { ProductType } from "./productsContextType";

export type UserT = {
  id: string;
  login: string;
  phone: string;
  createdAt: string;
  orders: ProductType[];
  role: number;
};

export type UserStoreStateT = {
  isLoading: boolean;
  error: string | null;
  user:UserAuthType | null; // Используем упрощенный тип
  products: ProductType[] | [];
  selectedProduct: null | ProductType;
  isEditing: boolean;
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  setIsEditing: (value: boolean) => void;
  handleProductClick: (product: ProductType) => void;
  handleCloseModal: () => void;
  setSelectedProduct: (newProduct: ProductType | null) => void | null;
  fetchProducts: () => Promise<void> | [];
  login: (login: string, password: string) => Promise<void>;
  checkAuth: () => Promise<boolean>;
  logout: () => Promise<void>;
};

// types/apiResponseType.ts - добавьте
export type CheckAuthUserType = {
  authenticated: boolean;
  user?: UserAuthType; // Используем упрощенный тип для auth
  shouldRefresh?: boolean;
  message?: string;
};
// Упрощенный тип для данных аутентификации
export interface UserAuthType {
  id: string;
  login: string;
  phone: string;
}