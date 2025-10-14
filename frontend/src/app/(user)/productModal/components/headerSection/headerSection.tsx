import { ProductType } from "@/app/lib/types/productsContextType";
import React from "react";

const HeaderSection = ({product}:{product: ProductType}) => {
  return (
    <div className="product-modal__header">
      <h2 className="product-modal__title">{product.name}</h2>
      <p className="product-modal__weight">{product.volume}</p>
      <p className="product-modal__description">
        {product.description || "Описание отсутствует"}
      </p>
      <p className="product-modal__note">
        *Блюдо подается теплым, но не горячим
      </p>
    </div>
  );
};

export default HeaderSection;
