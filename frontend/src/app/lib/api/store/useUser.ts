import { create } from "zustand";
import { LoginUserResponseType } from "../../types/apiResponseType";
import { ALL_PRODUCTS, CHECK_AUTH_USER, LOGIN_USER, LOGOUT_USER, REFRESH_AUTH_USER, REGISTER_USER } from "../constants/api";
import { request } from "./hooks/request";
import { ProductsResponseType } from "../../types/productsContextType";
import { CheckAuthUserType, UserStoreStateT } from "../../types/userStoreTypes";

export const useUser = create<UserStoreStateT>((set, get) => ({
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
      console.error('Logout error:', e);
    } finally {
      set({ user: null });
    }
  },
    checkAuth: async () => {
  set({ isLoading: true, error: null }); // Сбрасываем ошибку
  try {
    console.log("Making auth request to:", CHECK_AUTH_USER);
    
    const { data, error } = await request<CheckAuthUserType>(
      CHECK_AUTH_USER,
      "GET"
    );

    console.log("Check auth response:", data);

    // ✅ ИСПРАВЛЕНИЕ: Не бросаем ошибку сразу, а обрабатываем
    if (error) {
      console.warn('Auth check error:', error);
      set({ user: null, isLoading: false, error: null }); // Не блокируем приложение
      return false;
    }

    if (data?.authenticated && data.user) {
      set({ 
        user: data.user, 
        isLoading: false,
        error: null 
      });
      return true;
    }

    // Если сервер просит обновить токены
    if (data?.shouldRefresh) {
      console.log('Refreshing user tokens...');
      const { error: refreshError } = await request(
        REFRESH_AUTH_USER, 
        "POST"
      );

      if (!refreshError) {
        const { data: newAuthData } = await request<CheckAuthUserType>(
          CHECK_AUTH_USER, 
          "GET"
        );

        if (newAuthData?.authenticated && newAuthData.user) {
          set({ 
            user: newAuthData.user, 
            isLoading: false,
            error: null 
          });
          return true;
        }
      }
    }

    set({ user: null, isLoading: false, error: null });
    return false;

  } catch (e) {
    console.error('Auth check failed:', e);
    // ✅ ВАЖНО: Не блокируем приложение при ошибке сети
    set({ 
      user: null, 
      isLoading: false, 
      error: null // Не устанавливаем ошибку, чтобы приложение загрузилось
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



