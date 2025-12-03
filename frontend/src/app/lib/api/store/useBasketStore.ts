import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductType } from "../../types/productsContextType";
import { CartItemOptions } from "../../types/cartTypes";
import { request } from "./hooks/request";
import { BASKET } from "../constants/api";

type BasketResponse = {
  message: string;
  items: Array<{
    productId: string;
    quantity: number;
    productName: string;
    productPrice: number;
  }>;
  totalPrice: number;
};
export type BasketStoreItem = {
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
  fetchBasket: (item: BasketStoreItem) => Promise<BasketResponse>;
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
            const existingItem = state.items.find((cartItem) =>
                cartItem.product._id === item.product._id);

            let newItems: BasketStoreItem[];

            if (existingItem) {
              newItems = state.items.map((cartItem) =>
                cartItem.product._id === existingItem.product._id
                  ? {
                      ...cartItem,
                      options: {
                        ...cartItem.options,
                        quantity:
                          cartItem.options.quantity + item.options.quantity,
                      },
                    }
                  : cartItem
              );
            } else {
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
              (item) =>
                `${item.product._id}` !== id
            );
            const newTotal = calculateTotal(newItems);
            return {
              items: newItems,
              total: newTotal,
            };
          }),

        updateQuantity: (id, quantity) =>
          set((state) => {
            const newItems = state.items.map((item) =>
              `${item.product._id}` === id
                ? {
                    ...item,
                    options: {
                      ...item.options,
                      quantity: quantity,
                    },
                  }
                : item
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

        fetchBasket: async (item) => {
          const { product, options } = item;

          const { data, error } = await request(BASKET, "POST", {
            items: [
              {
                productId: product._id,
                quantity: options.quantity,
              },
            ],
          });

          if (error) {
            console.error("Error sending basket:", error);
            throw error;
          }

          return data as BasketResponse;
        },
      };
    },
    {
      name: "basket",
    }
  )
);
