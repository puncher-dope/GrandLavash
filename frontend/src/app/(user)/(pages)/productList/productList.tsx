// ProductPage/page.tsx
"use client";
import { useUser } from "@/app/lib/api/store/useUser";
import { SearchInput } from "@/app/lib/ui/searchInput";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import "./index.scss";
import { ProductCard } from "../../productCard/productCard";
import {  Spin } from "antd";
import { ProductModal } from "../../productModal/productModal";
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
  if (!products.length) return [];
  
  const search = searchTerm?.toLowerCase().trim() || "";
  const category = currentCategory?.toLowerCase() || "все";
  
  // ✅ Предварительная фильтрация по категории
  const categoryFiltered = category === "все" 
    ? products 
    : products.filter(p => 
        p.categories?.toLowerCase() === category
      );
  
  // ✅ Быстрый поиск
  if (!search) return categoryFiltered;
  
  return categoryFiltered.filter(product => 
    product.name?.toLowerCase().includes(search) ||
    product.categories?.toLowerCase().includes(search)
  );
}, [products, searchTerm, currentCategory]);

  if (isLoading || error) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p className="loading-text">Загружаем меню...</p>
      </div>
    );
  }

  return (
    <BasketLayout>
      <div className="product-list">
        <div className="product-list__content">
          <div className="search-input">
            <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <p>Ничего не найдено</p>
              <span>Попробуйте изменить поисковый запрос или категорию</span>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product)}
                className="product-list__card"
              >
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>

        {/* Модальное окно продукта */}
        {selectedProduct && (
          <ProductModal />
        )}
      </div>
    </BasketLayout> 
  );
};

export default ProductList;