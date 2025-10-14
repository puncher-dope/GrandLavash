import { Button } from "antd";
import React from "react";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useBasket } from "@/app/lib/api/store/useBasket";

type FooterSectionProps = {
  calculateTotalPrice: () => number;
  handleAddToCart: () => void;
};

const FooterSection = ({
  calculateTotalPrice,
  handleAddToCart,
}: FooterSectionProps) => {
  const { setQuantity, quantity } = useBasket();
  return (
    <div className="product-modal__footer">
      <div className="product-modal__quantity">
        <Button
          icon={<MinusOutlined />}
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          className="product-modal__quantity-btn"
        />
        <span className="product-modal__quantity-value">{quantity}</span>
        <Button
          icon={<PlusOutlined />}
          onClick={() => setQuantity((prev) => prev + 1)}
          className="product-modal__quantity-btn"
        />
      </div>

      <Button
        type="primary"
        size="large"
        className="product-modal__add-btn"
        onClick={handleAddToCart}
      >
        Добавить за {calculateTotalPrice()} ₽
      </Button>
    </div>
  );
};

export default FooterSection;
