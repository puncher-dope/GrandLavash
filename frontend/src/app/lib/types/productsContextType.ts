import { ProductData } from "./productEditorType"

export type ProductType = {
  _id: string;
  name: string;
  categories: string;
  subcategories?: string;
  price: number;
  volume: string;
  description?:string
  image: string;
  available: boolean
};

export type ProductsResponseType = {
  error?: string;
  products: ProductType[];
};
export type ApiProductsResponse = ProductType;

export type ProductsContextType = {
  products: ProductsResponseType["products"];
  selectedProduct: ProductsResponseType["products"][0] | null;
  loading: boolean;
  error: Error | string | null;
  fetchProducts: () => Promise<void>;
  createProduct: () => Promise<ProductType>
  updateProduct: (
    id: string,
    name: string,
    categories: string,
    price: number,
    volume: string,
    image: string,
    available: boolean,
    subcategories?: string,
    description?:string,
  ) => Promise<void>;
  deleteProduct: () => Promise<void>,
  setSelectedProduct: (product: ProductsResponseType["products"][0] | null) => void;
  editedData: ProductData,
  setEditedData: React.Dispatch<React.SetStateAction<ProductData>>

};
