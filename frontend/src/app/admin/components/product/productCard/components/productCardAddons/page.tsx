import { ProductType } from "@/app/lib/types/productsContextType";
import React from "react";



const ProductCardAddons = ({product}: {product: ProductType}) => {
  return (
    <div className="product-card__addons">
          <p style={{ fontWeight: '600', color: '#065f46' }}>🎯 Дополнения:</p>
          {product.addons!.map((addon, index) => (
            <div key={index}>
              <p>📌 {addon.name} - {addon.price}Р</p>
              <p>🔸 Обязательное: {addon.required ? "✅ Да" : "➖ Нет"}</p>
              <p>🔢 Макс. количество: {addon.maxQuantity}</p>
              <hr />
            </div>
          ))}
        </div>
  );
};

export default ProductCardAddons;
