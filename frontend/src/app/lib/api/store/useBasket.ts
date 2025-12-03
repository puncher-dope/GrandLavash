import { create } from "zustand";

type UseBasketT = {
  quantity: number;
};

export const useBasket = create<UseBasketT>(() => ({
  quantity: 1,
}));