import { create } from "zustand";
type UseBasketT = {
  quantity: number;
  setQuantity: (value: number | ((prevState: number) => number)) => void;
};

export const useBasket = create<UseBasketT>((set) => ({
  quantity: 1,

  setQuantity: (value) =>
    set((state) => ({
      quantity: typeof value === "function" ? value(state.quantity) : value,
    })),
}));