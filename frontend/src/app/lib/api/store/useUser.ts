import { create } from "zustand";
import { LoginUserResponseType } from "../../types/apiResponseType";
import { ALL_PRODUCTS, LOGIN_USER, REGISTER_USER } from "../constants/api";
import { request } from "./hooks/request";
import { ProductsResponseType } from "../../types/productsContextType";
import { UserStoreStateT } from "../../types/userStoreTypes";

export const useUser = create<UserStoreStateT>((set, get) => ({
  isLoading: true,
  error: null,
  user: null,
  products: [],
  selectedProduct: null,
  isEditing: false,
  modalVisible: false,
  setModalVisible: (value) => set({ modalVisible: value }),

  setIsEditing: (value) => set({ isEditing: value }),

  setSelectedProduct: (newProduct) =>
    set({ selectedProduct: newProduct || null }),

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const { error, data } = await request<ProductsResponseType>(
        ALL_PRODUCTS,
        "GET"
      );

      if (error) throw new Error(error);
      if (!data) throw new Error("No Data");

      console.log(data);
      set({
        products: data.products,
        error: null,
        selectedProduct: data.products[0],
        isLoading: false,
      });
    } catch (e) {
      return e instanceof Error
        ? set({ isLoading: false, error: e.message })
        : set({ isLoading: false, error: "" });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (login, phone) => {
    set({ isLoading: true });
        try {
      const { data } = await request<LoginUserResponseType>(
        REGISTER_USER,
        "POST",
        {
          login,
          phone,
        }
      );
      console.log("Произошла регистрация user", data);

      if (data?.error) {
        set({ error: data?.error });
        throw new Error(data.error);
      }
      set({
        user: data?.user,
        isLoading: false,
      });
    } catch {
      set({ isLoading: true });
      try {
        const { data } = await request<LoginUserResponseType>(
          LOGIN_USER,
          "POST",
          {
            login,
            phone,
          }
        );
        console.log("Произошло логирование user", data);

        if (data?.error) {
          set({ error: data.error });
          throw new Error(data.error);
        }

        set({
          user: data?.user,
          isLoading: false,
        });
      } catch (e) {
        return e instanceof Error
          ? set({ isLoading: false, error: e.message })
          : set({ isLoading: false, error: "" });
      } finally {
        set({ isLoading: false });
      }
    }
  },
  handleProductClick: (product) => {
    const { setSelectedProduct, setModalVisible } = get();
    setSelectedProduct(product);
    setModalVisible(true);
  },
  handleCloseModal: () => {
    const { setSelectedProduct, setModalVisible } = get();
    setModalVisible(false);
    setSelectedProduct(null);
  },
}))

