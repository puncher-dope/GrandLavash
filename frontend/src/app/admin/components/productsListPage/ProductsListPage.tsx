import {
  ProductProvider
} from "@/app/admin/context/productContext/productsContext";
import { ProductsListPageContent } from "../product/productListPageContent/productListPageContent";




export const ProductsListPage: React.FC = () => {
  return (
    <ProductProvider>
      <ProductsListPageContent />
    </ProductProvider>
  );
};
