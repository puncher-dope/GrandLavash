import { useProducts } from "@/app/admin/context/productContext/productsContext";
import { ProductEditorType, HandleInputChange } from "@/app/lib/types/productEditorType";
import React, { useEffect } from "react";
import MarkdownEdit from "../../markdownEdit/markdownEdit";
import './index.scss'

const ProductEditor: React.FC<ProductEditorType> = ({
  isEditing,
  setIsEditing
}) => {
  const { selectedProduct, updateProduct, setEditedData, editedData } = useProducts();

  useEffect(() => {
    if (isEditing && selectedProduct) {
      setEditedData({
        id: selectedProduct._id,
        name: selectedProduct.name,
        categories: selectedProduct.categories,
        price: selectedProduct.price,
        volume: selectedProduct.volume,
        image: selectedProduct.image,
        available: selectedProduct.available,
        subcategories: selectedProduct.subcategories || '',
        description: selectedProduct.description || '',
        addons: selectedProduct.addons || [],
        removableIngredients: selectedProduct.removableIngredients || [],
      });
    }
  }, [isEditing, selectedProduct, setEditedData]);

  if (!selectedProduct) {
    return <div className="product-editor__empty">Выберите товар для просмотра</div>;
  }

  const handleSave = async () => {
    if (!selectedProduct) {
      return;
    }

    try {
      // Фильтруем пустые дополнения и ингредиенты перед сохранением
      const filteredAddons = editedData.addons.filter(addon => 
        addon.name && addon.name.trim() !== ''
      );
      
      const filteredIngredients = editedData.removableIngredients.filter(ingredient => 
        ingredient.name && ingredient.name.trim() !== ''
      );

      await updateProduct(
        editedData.id,
        editedData.name,
        editedData.categories,
        editedData.price,
        editedData.volume,
        editedData.image,
        editedData.available,
        editedData.subcategories,
        editedData.description,
        filteredAddons,
        filteredIngredients
      );
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при сохранении продукта:', error);
    }
  };

  // Типизированная функция handleInputChange
  const handleInputChange: HandleInputChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="product-editor">
      {isEditing && (
        <MarkdownEdit
          handleInputChange={handleInputChange}
          handleSave={handleSave}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

export default ProductEditor;