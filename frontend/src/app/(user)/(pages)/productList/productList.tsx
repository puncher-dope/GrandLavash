// ProductPage/page.tsx
"use client";
import { useUser } from "@/app/lib/api/store/useUser";
import { SearchInput } from "@/app/lib/ui/searchInput";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import "./index.scss";
import { ProductCard } from "../../productCard/productCard";
import { Alert, Spin } from "antd";
import { ProductModal } from "../../productModal/productModal"; // Или создайте в components
import { BasketLayout } from "../../basket/basketLayot";

const ProductList = () => {
  const {
    products,
    fetchProducts,
    isLoading,
    selectedProduct,
    error,
    handleProductClick
  } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "все";

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product?.name || !product?.categories) return false;
      const search = searchTerm?.toLowerCase() || "";

      const categoryMatch =
        currentCategory === "все" ||
        product.categories.toLowerCase() === currentCategory!.toLowerCase();

      const searchMatch =
        product.name.toLowerCase().includes(search) ||
        product.categories.toLowerCase().includes(search);

      return searchMatch && categoryMatch;
    });
  }, [products, searchTerm, currentCategory]);


  if (isLoading) return <Spin />;
  if (error) return <Alert type="error" />;

  return (
    <BasketLayout>

    <div className="product-list">
      <div className="product-list__content">
        <div className="search-input">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {filteredProducts.map((product) => (
          <div
            key={product._id}
            onClick={() => handleProductClick(product)}
            className="product-list__card"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Модальное окно продукта */}
      {selectedProduct && (
        <ProductModal
        />
      )}
    </div>
    </BasketLayout> 
  );
};

export default ProductList;