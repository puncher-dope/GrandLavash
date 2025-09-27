
import { Spin, Alert } from "antd";
import React, { useEffect, useState } from "react";
import ProductList from "../productList/productList";
import ProductEditor from "../productEditor/productEditor";
import { ProductData } from "@/app/shared/types/productEditorType";
import { ProductEditorModal } from "../productEditorModel/productEditorModel";
import { useProducts } from "@/app/admin/context/productContext/productsContext";
import './index.scss'


export const ProductsListPageContent: React.FC = () => {
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

  if (loading) return <Spin size="large" />

  if (error) return <Alert message="Ошибка загрузки продуктов" type="error" />;

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