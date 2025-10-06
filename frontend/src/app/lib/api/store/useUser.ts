import { create } from "zustand";
import { LoginUserResponseType } from "../../types/apiResponseType";
import { ALL_PRODUCTS, LOGIN_USER, REGISTER_USER } from "../constants/api";
import { request } from "@/app/hooks/request";
import {
  ProductsResponseType,
  ProductType,
} from "../../types/productsContextType";

type UserT = {
  id: string;
  createdAt: string;
  login: string;
  phone: string;
  orders: ProductType[];
  role: number;
};

type StoreStateT = {
  isLoading: boolean;
  error: string | null;
  user: UserT | null;
  products: ProductType[] | null;

  fetchProducts: () => Promise<void> | null
  login: (login: string, password: string) => Promise<void>;
};

export const useUser = create<StoreStateT>((set) => ({
  isLoading: false,
  error: null,
  user: null,
  products: null,

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const { error, data } = await request<ProductsResponseType>(
        ALL_PRODUCTS,
        "GET"
      );

      if (error) throw new Error(error);
      if (!data) throw new Error("No Data");


      console.log(data)
      set({ products: data.products, error: null, isLoading: false });
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
}));
