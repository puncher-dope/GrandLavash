import { useProducts } from "@/app/shared/api/context/productsContext";
// import { ProductListType } from "@/app/shared/types/productEditorType";
import React, { useMemo } from "react";
import { SearchInput } from "../searchInput";
import { Button } from "antd";
import { ProductCard } from "../productCard/ProductCard";
import './index.scss'
import { ProductType } from "@/app/shared/types/productsContextType";


type ProductListType = {
  searchTerm: string,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}


const ProductList: React.FC<ProductListType> = ({
  searchTerm,
  setSearchTerm,
  isEditing,
  setIsEditing,
}) => {
  const { products, loading, createProduct, setSelectedProduct, selectedProduct } =
    useProducts();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product?.name || !product?.categories) return false;

      const search = searchTerm?.toLowerCase() || "";
      return (
        product.name.toLowerCase().includes(search) ||
        product.categories.toLowerCase().includes(search)
      );
    });
  }, [products, searchTerm]);


  
  const handleCreateNewTask = async () => {
    setSearchTerm("");
    const newProduct = await createProduct();
    if (newProduct) {
      setIsEditing(true);
    }
  };

  // Функция выбора продукта для редактирования
  const handleProductSelect = (product: ProductType) => {
    setSelectedProduct(product);
    setIsEditing(true);
  };

  if (loading) return null;

  return (
    <div className="product-list">
      <div className="product-list__content">
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Button type="primary" onClick={handleCreateNewTask} block>
          + Создать новый продукт
        </Button>

        {filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductSelect(product)}
              className={`product-list__card ${
                selectedProduct?._id === product._id ? 'product-list__card--active' : ''
              }`}
            >
              <ProductCard
                product={product}
                isEditing={isEditing && selectedProduct?._id === product._id}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProductList;