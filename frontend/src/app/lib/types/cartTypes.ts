import { ProductType, RemovableIngredientsType } from "./productsContextType";

// types/cartTypes.ts или добавьте в существующий файл
export interface SelectedAddonOption {
  addonId: string;
  optionId: string;
  name: string;
  price: number;
}

export interface CartItemOptions {
  // Выбранные аддоны в формате: { [addonId]: optionId | optionId[] }
  addons: SelectedAddonWithQuantity;
  
  // Удаленные ингредиенты
  removedIngredients: RemovableIngredientsType[];
  
  // Количество
  quantity: number;
  
  // Общая цена (основа + все дополнения) * количество
  totalPrice: number;

}

// Полный тип для элемента корзины
export interface CartItem {
  product: ProductType;
  options: CartItemOptions;
  id: string; // Уникальный ID комбинации продукт + опции
  addedAt: string;
}
export type SelectedAddonWithQuantity = {
  [addonId: string]: {
    optionName: string;
    quantity: number;
    price: number;
  }[];
};