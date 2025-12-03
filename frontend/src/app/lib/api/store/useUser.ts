
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginUserResponseType } from "../../types/apiResponseType";
import {
  ALL_PRODUCTS,
  CHECK_AUTH_USER,
  LOGIN_USER,
  LOGOUT_USER,
  REGISTER_USER,
} from "../constants/api";
import { request } from "./hooks/request";
import { ProductsResponseType } from "../../types/productsContextType";
import { CheckAuthUserType, UserStoreStateT } from "../../types/userStoreTypes";

export const useUser = create<UserStoreStateT>()(
  persist(
    (set, get) => ({
      isLoading: true,
      error: null,
      user: null,
      products: [],
      selectedProduct: null,
      isEditing: false,
      modalVisible: false,

      logout: async () => {
        try {
          await request(LOGOUT_USER, "POST");
        } catch (e) {
          console.error("Logout error:", e);
        } finally {
          set({ user: null });
          localStorage.removeItem("user-storage");
        }
      },

      checkAuth: async () => {

        set({ isLoading: true, error: null });

        try {

          const { data, error } = await request<CheckAuthUserType>(
            CHECK_AUTH_USER,
            "GET"
          );

          if (error) {
            console.warn("Auth check error:", error);
            set({ user: null, isLoading: false, error: null });
            return false;
          }

          if (data?.authenticated && data.user) {
            set({
              user: data.user,
              isLoading: false,
              error: null,
            });
            return true;
          }

          console.warn("⚠️ User not authenticated in response");
          set({ user: null, isLoading: false, error: null });
          return false;
        } catch (e) {
          console.error("❌ Auth check failed:", e);
          set({
            user: null,
            isLoading: false,
            error: null,
          });
          return false;
        }
      },

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
        set({ isLoading: true, error: null });

        try {
          const registerResponse = await request<LoginUserResponseType>(
            REGISTER_USER,
            "POST",
            {
              login,
              phone,
            }
          );

          if (registerResponse.data?.user) {
            set({
              user: registerResponse.data.user,
              isLoading: false,
              error: null,
            });
            return true;
          }
          const loginResponse = await request<LoginUserResponseType>(
            LOGIN_USER,
            "POST",
            {
              login,
              phone,
            }
          );

          if (loginResponse.data?.user) {
            set({
              user: loginResponse.data.user,
              isLoading: false,
              error: null,
            });
            return true;
          }

          console.error("❌ Both register and login failed");
          set({
            isLoading: false,
            error: loginResponse.error || registerResponse.error || "Login failed",
          });
          return false;

        } catch (e) {
          console.error("❌ Login process error:", e);
          set({
            isLoading: false,
            error: e instanceof Error ? e.message : "Unknown error",
          });
          return false;
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
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);