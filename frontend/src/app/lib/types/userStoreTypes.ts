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
  user: UserAuthType | null;
  products: ProductType[] | [];
  selectedProduct: null | ProductType;
  isEditing: boolean;
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  setIsEditing: (value: boolean) => void;
  handleProductClick: (product: ProductType) => void;
  handleCloseModal: () => void;
  setSelectedProduct: (newProduct: ProductType | null) => void;
  fetchProducts: () => Promise<unknown>; 
  login: (login: string, phone: string) => Promise<boolean>; 
  checkAuth: () => Promise<boolean>;
  logout: () => Promise<void>;
};

export type CheckAuthUserType = {
  authenticated: boolean;
  user?: UserAuthType;
  shouldRefresh?: boolean;
  message?: string;
};

export interface UserAuthType {
  id: string;
  login: string;
  phone: string;
}