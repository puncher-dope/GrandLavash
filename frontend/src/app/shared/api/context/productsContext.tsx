import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  AddonType,
  ApiProductsResponse,
  ProductsContextType,
  ProductsResponseType,
  RemovableIngredientsType,
} from "../../types/productsContextType";
import { request } from "@/app/hooks/request";
import { ALL_PRODUCTS } from "../constants/api";

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

const ProductContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<ProductsResponseType["products"]>(
    []
  );
  const [selectedProduct, setSelectedProduct] = useState<
    ProductsResponseType["products"][0] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { error, data } = await request<ProductsResponseType>(
        ALL_PRODUCTS,
        "GET"
      );

      if (error) throw new Error(error);
      if (!data) throw new Error("No data");

      setProducts(data.products);
      setError(null);
      if (data.products.length > 0) {
        setSelectedProduct(data.products[0]);
      }
    } catch (reason) {
      const err = reason instanceof Error ? reason : new Error(String(reason));
      setError(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);


  const createProduct = useCallback(async () => {
    try {
      const { error, data: response } = await request<ApiProductsResponse>(
        ALL_PRODUCTS,
        "POST",
        {
          name: "Новый продукт",
          categories: "Новая категория",
          price: 0,
          volume: "0",
          image: "",
          available: true,
          subcategories: "",
          addons: [],
          removableIngredients: [],
        }
      );

      if (error) throw new Error(error);
      if (!response?.data) throw new Error("почтовые данные не получены");

      const newProduct = { ...response.data };
      setProducts((prev) => [newProduct, ...prev]);
      setSelectedProduct(newProduct);
      return newProduct;
    } catch (reason) {
      console.error("Ошибка при создании поста:", reason);
      setError(reason instanceof Error ? reason : new Error(String(reason)));
      throw reason;
    }
  }, []);


  const updateProduct = useCallback(
    async (
      id: string,
      name: string,
      categories: string,
      price: number,
      volume: string,
      image: string,
      available: boolean,
      subcategories?: string,
      addons?: AddonType[],
      removableIngredients?: RemovableIngredientsType[]
    ) => {
      try {
        const { error } = await request(`${ALL_PRODUCTS}/${id}`, "PATCH", {
          name,
          categories,
          price,
          volume,
          image,
          available,
          subcategories,
          addons,
          removableIngredients,
        });

        if (error) throw new Error(error || "Failed to update task");

        const updatedProducts = products.map((product) =>
          product.id === id
            ? {
                ...product,
                name,
                categories,
                price,
                volume,
                image,
                available,
                subcategories,
                addons,
                removableIngredients,
              }
            : product
        );
        setProducts(updatedProducts);

        if (selectedProduct?.id === id) {
          setSelectedProduct({
            ...selectedProduct,
            name,
            categories,
            price,
            volume,
            image,
            available,
            subcategories,
            addons,
            removableIngredients,
          });
        }
      } catch (reason) {
        console.error("Ошибка при сохранении:", reason);
        throw reason;
      }
    },
    [selectedProduct, products]
  );


    const deleteProduct = useCallback(async () => {
    if (!selectedProduct) return;

    try {
      const { error } = await request(
        `${ALL_PRODUCTS}/${selectedProduct.id}`,
        "DELETE"
      );

      if (error) {
        throw new Error(error || "Failed to delete task");
      }
      const updatedProducts = products.filter((task) => task.id !== selectedProduct.id);
      setProducts(updatedProducts);

      setSelectedProduct(updatedProducts.length > 0 ? updatedProducts[0] : null);
    } catch (reason) {
      console.error("Ошибка при удалении:", reason);
    }
  }, [selectedProduct, products]);



  return(
    <ProductContext.Provider
        value ={{
            products,
            selectedProduct,
            loading,
            error,
            fetchProducts,
            createProduct,
            updateProduct,
            deleteProduct,
            setSelectedProduct,
        }}
    >
        {children}
    </ProductContext.Provider>
  )
};
