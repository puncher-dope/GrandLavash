import { create } from "zustand";
import { SelectedAddonWithQuantity } from "../../types/cartTypes";
import { ProductType } from "../../types/productsContextType";
export type AddonSectionsT = {
  id: string;
  name: string;
  type: "radio" | "checkbox";
  required: boolean;
  maxSelection: number;
  options: {
    id: string;
    name: string;
    price: number;
    volume: string;
  }[];
};

export type RemovableIngredientsT = {
  id: string;
  name: string;
};
type UseBasketT = {
  selectedAddons: SelectedAddonWithQuantity;
  removedIngredients: string[];
  quantity: number;
  setQuantity: (value: number | ((prevState: number) => number)) => void;
  setRemovedIngredients: (
    value: string[] | ((prevState: string[]) => string[])
  ) => void;
  setSelectedAddons: (
    value:
      | SelectedAddonWithQuantity
      | ((prev: SelectedAddonWithQuantity) => SelectedAddonWithQuantity)
  ) => void;
  getAddonSections: (product: ProductType) => AddonSectionsT[];
  getRemovableIngredients: (product: ProductType) => RemovableIngredientsT[];
  handleRadioAddonChange: (
    addonId: string,
    optionName: string,
    price: number
  ) => void;
  handleCheckboxAddonChange: (
    addonId: string,
    optionName: string,
    checked: boolean,
    price: number
  ) => void;
  handleAddonQuantityChange: (
    addonId: string,
    optionName: string,
    newQuantity: number
  ) => void;
  getAddonQuantity: (addonId: string, optionName: string) => number;
  isAddonSelected: (addonId: string, optionName: string) => boolean;
  handleRemovableChange: (ingredientId: string, checked: boolean) => void;
};



export const useBasket = create<UseBasketT>((set, get) => ({
  selectedAddons: {},
  removedIngredients: [],
  quantity: 1,




  setQuantity: (value) =>
    set((state) => ({
      quantity: typeof value === "function" ? value(state.quantity) : value,
    })),

  setRemovedIngredients: (value) =>
    set((state) => ({
      removedIngredients:
        typeof value === "function" ? value(state.removedIngredients) : value,
    })),

  setSelectedAddons: (value) =>
    set((state) => ({
      selectedAddons:
        typeof value === "function" ? value(state.selectedAddons) : value,
    })),
  getAddonSections: (product) => {
    if (!product.addons || product.addons.length === 0) return [];

    return product.addons.map((addon, index) => ({
      id: `addon-${index}`,
      name: addon.name || `Дополнение ${index + 1}`,
      type: addon.required ? "radio" : ("checkbox" as "radio" | "checkbox"),
      required: addon.required,
      maxSelection: addon.maxQuantity,
      options: [
        {
          id: `option-${index}`,
          name: addon.name || `Опция ${index + 1}`,
          price: addon.price,
          volume: "",
        },
      ],
    }));
  },
  getRemovableIngredients: (product) => {
    if (
      !product.removableIngredients ||
      product.removableIngredients.length === 0
    )
      return [];

    return product.removableIngredients.map((ingredient, index) => ({
      id: `removable-${index}`,
      name: ingredient.name || 'No name',
    }));
  },
  handleRadioAddonChange: (addonId, optionName, price) => {
    const { setSelectedAddons } = get();
    setSelectedAddons((prev) => ({
      ...prev,
      [addonId]: [{ optionName, quantity: 1, price }],
    }));
  },

  handleCheckboxAddonChange: (addonId, optionName, checked, price) => {
    const { setSelectedAddons } = get();
    setSelectedAddons((prev) => {
      const currentAddons = prev[addonId] || [];

      if (checked) {
        // Добавляем аддон с количеством 1
        return {
          ...prev,
          [addonId]: [...currentAddons, { optionName, quantity: 1, price }],
        };
      } else {
        // Удаляем аддон
        return {
          ...prev,
          [addonId]: currentAddons.filter(
            (item) => item.optionName !== optionName
          ),
        };
      }
    });
  },
  handleAddonQuantityChange: (addonId, optionName, newQuantity) => {
    const { setSelectedAddons } = get();
    setSelectedAddons((prev) => {
      const currentAddons = prev[addonId] || [];
      const addonIndex = currentAddons.findIndex(
        (item) => item.optionName === optionName
      );

      if (addonIndex === -1) return prev;

      const updatedAddons = [...currentAddons];
      updatedAddons[addonIndex] = {
        ...updatedAddons[addonIndex],
        quantity: newQuantity,
      };

      return {
        ...prev,
        [addonId]: updatedAddons,
      };
    });
  },
  getAddonQuantity: (addonId, optionName) => {
    const { selectedAddons } = get();
    const addons = selectedAddons[addonId] || [];
    const addon = addons.find((item) => item.optionName === optionName);
    return addon ? addon.quantity : 0;
  },
  isAddonSelected: (addonId, optionName) => {
    const { selectedAddons } = get();
    const addons = selectedAddons[addonId] || [];
    return addons.some((item) => item.optionName === optionName);
  },
  handleRemovableChange: (ingredientName, checked) => {
    const { setRemovedIngredients } = get();

    setRemovedIngredients((prev) =>
      checked
        ? [...prev, ingredientName]
        : prev.filter((name) => name !== ingredientName)
    );
  },
}));
