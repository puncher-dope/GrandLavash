
"use client";
import React from "react";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./index.scss";
import { CartItemOptions } from "@/app/lib/types/cartTypes";
import { useBasket } from "@/app/lib/api/store/useBasket";
import { useUser } from "@/app/lib/api/store/useUser";
import ImageSection from "./components/imageSection/imageSection";
import HeaderSection from "./components/headerSection/headerSection";
import FooterSection from "./components/footerSection/footerSection";
import { useBasketStore } from "@/app/lib/api/store/useBasketStore";

export const ProductModal: React.FC = () => {
  const {
    quantity
  } = useBasket();
  const {
    handleCloseModal: onClose,
    selectedProduct: product,
    modalVisible: visible,
  } = useUser();

  const {addItem} = useBasketStore()

  if (product === null) return null;
  

  const calculateTotalPrice = (): number => {
    const total = product?.price || 0;
    return total * quantity;
  };

const handleAddToCart = () => {
  const selectedOptions: CartItemOptions = {
    quantity: quantity,
    totalPrice: calculateTotalPrice(),
  };
  
  
  const item = {
    product: product,
    options: selectedOptions,
  }
  
  addItem(item);
  alert(`${product.name} добавлен в корзину!`);
  onClose();
};


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
