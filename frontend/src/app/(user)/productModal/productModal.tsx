// components/ProductModal/page.tsx
"use client";
import React, { useEffect } from "react";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./index.scss";
import { CartItemOptions } from "@/app/lib/types/cartTypes";
import { useBasket } from "@/app/lib/api/store/useBasket";
import { useUser } from "@/app/lib/api/store/useUser";
import ImageSection from "./components/imageSection/imageSection";
import HeaderSection from "./components/headerSection/headerSection";
import AddonSection from "./components/addonSection/addonSection";
import RemoveSection from "./components/removeSection/removeSection";
import NutritionSection from "./components/nutritionSection/nutritionSection";
import FooterSection from "./components/footerSection/footerSection";
import { useBasketStore } from "@/app/lib/api/store/useBasketStore";

export const ProductModal: React.FC = () => {
  const {
    selectedAddons,
    getAddonSections,
    getRemovableIngredients,
    removedIngredients,
    quantity,
    setQuantity,
    setSelectedAddons,
    setRemovedIngredients
  } = useBasket();
  const {
    handleCloseModal: onClose,
    selectedProduct: product,
    modalVisible: visible,
  } = useUser();

  useEffect(() => {
    if (visible && product) {
      // Сбрасываем состояние при каждом открытии модального окна
      setSelectedAddons({});
      setRemovedIngredients([]);
      setQuantity(1);
    }
  }, [visible, product, setSelectedAddons, setRemovedIngredients, setQuantity]);

  const {addItem} = useBasketStore()

  if (product === null) return null;
  

  const calculateTotalPrice = (): number => {
    let total = product?.price || 0;
    // Добавляем стоимость выбранных аддонов с учетом количества
    Object.values(selectedAddons).forEach((addonItems) => {
      addonItems.forEach(({ price, quantity }) => {
        total += price * quantity;
      });
    });

    return total * quantity;
  };

const handleAddToCart = () => {
  const selectedOptions: CartItemOptions = {
    addons: selectedAddons,    // ← должно быть selectedAddons
    removedIngredients: removedIngredients,
    quantity: quantity,
    totalPrice: calculateTotalPrice(),
  };
  
  console.log("Добавлено в корзину:", removedIngredients);
  console.log("Добавлено в корзину:", {
    product: product,
    options: selectedOptions,
  });
  
  const item = {
    product: product,
    options: selectedOptions,
  }
  
  addItem(item);
  alert(`${product.name} добавлен в корзину!`);
  onClose();
};


  const addonSections = getAddonSections(product);
  const removableIngredients = getRemovableIngredients(product);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1200}
      className="product-modal"
      closeIcon={<CloseOutlined />}
    >
      <div className="product-modal__content">
        {/* Секция с изображением */}
        <ImageSection product={product} />

        {/* Секция с информацией */}
        <div className="product-modal__info-section">
          {/* Заголовок и основная информация */}
          <HeaderSection product={product} />

          {/* Дип соусы и дополнения */}
          {addonSections.map((addon) => (
            <AddonSection addon={addon} key={addon.id} />
          ))}

          {/* Остальной код остается без изменений */}
          {/* Удаляемые ингредиенты */}
          {removableIngredients.length > 0 && (
            <RemoveSection removableIngredients={removableIngredients} />
          )}

          {/* Пищевая ценность */}
          <NutritionSection />

          {/* Футер с количеством и ценой */}
          <FooterSection
            calculateTotalPrice={calculateTotalPrice}
            handleAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </Modal>
  );
};
