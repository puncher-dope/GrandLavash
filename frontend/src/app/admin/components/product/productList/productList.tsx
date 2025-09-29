import { useProducts } from "@/app/admin/context/productContext/productsContext";
// import { ProductListType } from "@/app/shared/types/productEditorType";
import React, { useMemo } from "react";
import { SearchInput } from "../../searchInput";
import { Button } from "antd";
import { ProductCard } from "../productCard/ProductCard";
import './index.scss'
import { ProductType } from "@/app/lib/types/productsContextType";
import { ProductListType } from "@/app/lib/types/productEditorType";


const ProductList: React.FC<ProductListType> = ({
  searchTerm,
  setSearchTerm,
  isEditing,
  setIsEditing,
  currentCategory,
}) => {
  const { products, loading, createProduct, setSelectedProduct, selectedProduct } =
    useProducts();


  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product?.name || !product?.categories) return false;
      const search = searchTerm?.toLowerCase() || "";
      

      //фильтр по URL параметрами
      const categoryMatch = 
        currentCategory === 'все' ||
        product.categories.toLowerCase() === currentCategory!.toLowerCase()

      //фильтр по поиску
      const searchMatch =
        product.name.toLowerCase().includes(search) ||
        product.categories.toLowerCase().includes(search)
      

      return searchMatch && categoryMatch
    });
  }, [products, searchTerm, currentCategory]);


  
  const handleCreateNewProduct = async () => {
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
        <Button type="primary" onClick={handleCreateNewProduct} block>
          + Создать новый продукт
        </Button>


        {/* Показываем количество отфильтрованных товаров */}
        <div style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
          {currentCategory}: {filteredProducts.length}
        </div>

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