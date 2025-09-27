import { ProductData } from "./productEditorType"

export type AddonType = {
    name:string
    price: number,
    required: boolean,
    maxQuantity: number
}

export type RemovableIngredientsType = {
    name: string
}

export type ProductType = {
  _id: string;
  name: string;
  categories: string;
  subcategories?: string;
  price: number;
  volume: string;
  image: string;
  available: boolean
  addons?: AddonType[]
  removableIngredients?: RemovableIngredientsType[]
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
    addons?: AddonType[],
    removableIngredients?: RemovableIngredientsType[]
  ) => Promise<void>;
  deleteProduct: () => Promise<void>,
  setSelectedProduct: (product: ProductsResponseType["products"][0] | null) => void;
  editedData: ProductData,
  setEditedData: React.Dispatch<React.SetStateAction<ProductData>>

};
