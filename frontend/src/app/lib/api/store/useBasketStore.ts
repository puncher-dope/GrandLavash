// useBasketStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductType } from "../../types/productsContextType";
import { CartItemOptions } from "../../types/cartTypes";

type BasketStoreItem = {
  product: ProductType;
  options: CartItemOptions;
};

type useBasketStoreT = {
  items: BasketStoreItem[];
  total: number;
  addItem: (item: BasketStoreItem) => void;
  removeItems: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearItems: () => void;
  getTotalPrice: () => number;
};

export const useBasketStore = create<useBasketStoreT>()(
  persist(
    (set, get) => {
      const calculateTotal = (items: BasketStoreItem[]) => {
        return items.reduce((total, item) => {
          const basePrice = item.options.totalPrice || item.product.price || 0;
          const baseQuantity = item.options.quantity || 1;
          return total + basePrice * baseQuantity;
        }, 0);
      };

      return {
        items: [],
        total: 0,
        addItem: (item) =>
          set((state) => {
            // Ищем существующий товар с ТАКИМИ ЖЕ опциями
            const existingItem = state.items.find(
              (cartItem) =>
                cartItem.product._id === item.product._id &&
                JSON.stringify(cartItem.options.addons) ===
                  JSON.stringify(item.options.addons) &&
                JSON.stringify(cartItem.options.removedIngredients) ===
                  JSON.stringify(item.options.removedIngredients)
            );

            let newItems: BasketStoreItem[];
            
            if (existingItem) {
              // Если нашли товар с такими же опциями - увеличиваем количество
              newItems = state.items.map((cartItem) =>
                cartItem.product._id === existingItem.product._id &&
                JSON.stringify(cartItem.options.addons) ===
                  JSON.stringify(existingItem.options.addons) &&
                JSON.stringify(cartItem.options.removedIngredients) ===
                  JSON.stringify(existingItem.options.removedIngredients)
                  ? {
                      ...cartItem,
                      options: {
                        ...cartItem.options,
                        quantity: cartItem.options.quantity + item.options.quantity,
                      },
                    }
                  : cartItem
              );
            } else {
              // Если не нашли - добавляем новый товар
              newItems = [...state.items, item];
            }
            
            const newTotal = calculateTotal(newItems);
            return {
              items: newItems,
              total: newTotal,
            };
          }),
        removeItems: (id) =>
          set((state) => {
            const newItems = state.items.filter(
              (product) => product.product._id !== id
            );
            const newTotal = calculateTotal(newItems);
            return {
              items: newItems,
              total: newTotal,
            };
          }),
        updateQuantity: (id, quantity) =>
          set((state) => {
            const newItems = state.items.map((product) =>
              product.product._id === id
                ? {
                    ...product,
                    options: {
                      ...product.options,
                      quantity: quantity,
                    },
                  }
                : product
            );
            const newTotal = calculateTotal(newItems);
            return {
              items: newItems,
              total: newTotal,
            };
          }),
        clearItems: () => set({ items: [], total: 0 }),
        getTotalPrice: () => {
          const { items } = get();
          return calculateTotal(items);
        },
      };
    },
    {
      name: "basket",
    }
  )
);