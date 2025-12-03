
"use client";
import { useUser } from "@/app/lib/api/store/useUser";
import { SearchInput } from "@/app/lib/ui/searchInput";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import "./index.scss";
import { ProductCard } from "../../productCard/productCard";
import { notification, Spin } from "antd";
import { ProductModal } from "../../productModal/productModal";
import { BasketLayout } from "../../basket/basketLayot";
import { ProductType } from "@/app/lib/types/productsContextType";

const ProductList = () => {
  const {
    products,
    fetchProducts,
    isLoading,
    selectedProduct,
    error,
    handleProductClick,
  } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "все";

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categorizedProducts = useMemo(() => {
    if (!products.length) return {};

    const search = searchTerm?.toLowerCase().trim() || "";
    const category = currentCategory?.toLowerCase() || "все";

    let filtered = products;
    if (search) {
      filtered = products.filter(
        (product) =>
          product.name?.toLowerCase().includes(search) ||
          product.categories?.toLowerCase().includes(search) ||
          product.description?.toLowerCase().includes(search)
      );
    }

    if (category !== "все") {
      filtered = filtered.filter(
        (product) => product.categories?.toLowerCase() === category
      );
    }
    const grouped: { [key: string]: ProductType[] } = {};

    filtered.forEach((product) => {
      const categoryName = product.categories || "Без категории";
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(product);
    });

    return grouped;
  }, [products, searchTerm, currentCategory]);

  const handleProductAdded = (product: ProductType) => {
    alert(`${product.name} добавлен в корзину`)
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p className="loading-text">Загружаем меню...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Ошибка загрузки: {error}</p>
      </div>
    );
  }

  const categories = Object.keys(categorizedProducts);
  const totalProducts = Object.values(categorizedProducts).flat().length;

  return (
    <BasketLayout>
      <div className="product-list-container">
        <div className="search-input-wrapper">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {totalProducts === 0 ? (
          <div className="empty-state">
            <p>Ничего не найдено</p>
            <span>Попробуйте изменить поисковый запрос или категорию</span>
          </div>
        ) : (
          <div className="categorized-products">
            {categories.map((category) => {
              const categoryProducts = categorizedProducts[category];
              const categorySlug = category.toLowerCase();

              return (
                <div key={category} className="category-section">
                  {/* Заголовок категории */}
                  <div className="category-header" id={categorySlug}>
                    <h2 className="category-title">
                      {category}
                      <span className="category-count">
                        ({categoryProducts.length})
                      </span>
                    </h2>
                    <div className="category-divider"></div>
                  </div>

                  {/* Товары категории */}
                  <div className="category-grid">
                    {categoryProducts.map((product: ProductType) => (
                      <div
                        key={product._id}
                        onClick={() => handleProductClick(product)}
                        className="product-item"
                      >
                        <ProductCard
                          product={product}
                          onAddToCart={handleProductAdded}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedProduct && <ProductModal />}
      </div>
    </BasketLayout>
  );
};

export default ProductList;
