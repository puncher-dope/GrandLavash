import {
  ProductProvider,
  useProducts,
} from "@/app/shared/api/context/productsContext";
import { Spin, Alert } from "antd";
import React, { useEffect, useState } from "react";
import ProductList from "../productList/productList";
import ProductEditor from "../productEditor/productEditor";
import { ProductData } from "@/app/shared/types/productEditorType";
import './index.scss'

// Компонент модального окна
const ProductEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="product-editor-modal">
      <div 
        className="product-editor-modal__overlay" 
        onClick={onClose}
      >
        <div 
          className="product-editor-modal__content" 
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="product-editor-modal__close"
            onClick={onClose}
          >
            ×
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

const ProductsListPageContent: React.FC = () => {
  const { fetchProducts, loading, error } = useProducts();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ProductData>({
    id: "",
    name: "",
    categories: "",
    subcategories: "",
    price: 0,
    volume: "",
    image: "",
    available: true,
    addons: [],
    removableIngredients: [],
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Функция закрытия модального окна
  const handleCloseModal = () => {
    setIsEditing(false);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Ошибка загрузки продуктов" type="error" />;
  }

  return (
    <div className="product-list-page">
      <div className="product-list-page__content">
        <ProductList
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />

        {/* Модальное окно редактора */}
        <ProductEditorModal 
          isOpen={isEditing} 
          onClose={handleCloseModal}
        >
          <ProductEditor
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            editedData={editedData}
            setEditedData={setEditedData}
          />
        </ProductEditorModal>
      </div>
    </div>
  );
};

export const ProductsListPage: React.FC = () => {
  return (
    <ProductProvider>
      <ProductsListPageContent />
    </ProductProvider>
  );
};
