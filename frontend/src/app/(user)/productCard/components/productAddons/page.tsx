// ProductCard/components/productAddons/page.tsx
import { ProductType } from "@/app/lib/types/productsContextType";
import React from "react";
import "./index.scss";

const ProductAddons = ({product}: {product: ProductType}) => {
  return (
    <div className="product-addons">
      <h4 className="product-addons__title">
        <span>🎯</span>
        Дополнения
      </h4>
      {product.addons!.map((addon, index) => (
        <div key={index} className="product-addons__item">
          <p className="product-addons__name">
            📌 {addon.name} - <span className="product-addons__price">{addon.price}Р</span>
          </p>
          <p>
            <span className="product-addons__required">
              Обязательное: {addon.required ? "✅ Да" : "➖ Нет"}
            </span>
          </p>
          <p>Макс. количество: {addon.maxQuantity}</p>
          <hr className="product-addons__divider" />
        </div>
      ))}
    </div>
  );
};

export default ProductAddons;