import { ProductType } from "./productsContextType";

// types/cartTypes.ts или добавьте в существующий файл
export interface SelectedAddonOption {
  addonId: string;
  optionId: string;
  name: string;
  price: number;
}

export interface CartItemOptions {
  // Выбранные аддоны в формате: { [addonId]: optionId | optionId[] }
  addons: Record<string, string | string[]|null>;
  
  // Удаленные ингредиенты
  removedIngredients: string[];
  
  // Количество
  quantity: number;
  
  // Общая цена (основа + все дополнения) * количество
  totalPrice: number;
  
  // Дополнительная информация (опционально)
  notes?: string;
}

// Полный тип для элемента корзины
export interface CartItem {
  product: ProductType;
  options: CartItemOptions;
  id: string; // Уникальный ID комбинации продукт + опции
  addedAt: string;
}