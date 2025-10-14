import { useBasketStore } from "@/app/lib/api/store/useBasketStore";
import { CartItemOptions } from "@/app/lib/types/cartTypes";
import { ProductType } from "@/app/lib/types/productsContextType";

import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import React from "react";

type BasketItemProps = {
    product:ProductType,
  options: CartItemOptions,
  removedIngredientsList: string[] | null,
  addonsList:string[] | null,
}



const BasketItem = ({
  product,
  options,
  removedIngredientsList,
  addonsList,
}:BasketItemProps) => {
  const { removeItems, updateQuantity } =
    useBasketStore();
  const handleQuantityChange = (
    productId: string,
    currentQuantity: number,
    change: number
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) {
      removeItems(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeItems(productId);
  };
  return (
    <div
      key={`${product._id}-${JSON.stringify(options)}`}
      className="basket-item"
    >
      <div className="basket-item__info">
        <h3 className="basket-item__name">{product.name}</h3>

        {/* Описание товара */}
        {product.description && (
          <p className="basket-item__description">
            {product.description.length > 60
              ? `${product.description.substring(0, 60)}...`
              : product.description}
          </p>
        )}

        {/* Дополнения */}
        {addonsList && addonsList.length > 0 && (
          <div className="basket-item__addons">
            <span className="basket-item__addons-label">Дополнения:</span>
            {addonsList.map((addon, index) => (
              <span key={index} className="basket-item__addon">
                {addon}
              </span>
            ))}
          </div>
        )}

        {/* Удаленные ингредиенты */}
        {removedIngredientsList && removedIngredientsList.length > 0 && (
          <div className="basket-item__removed">
            {removedIngredientsList.map((ingredient, index) => (
              <span key={index} className="basket-item__removed-ingredient">
                {ingredient}
              </span>
            ))}
          </div>
        )}

        <div className="basket-item__price">
          {options.totalPrice || product.price} ₽
        </div>
      </div>

      <div className="basket-item__controls">
        <div className="quantity-controls">
          <button
            className="quantity-btn"
            onClick={() =>
              handleQuantityChange(product._id, options.quantity, -1)
            }
          >
            <MinusOutlined />
          </button>
          <span className="quantity-display">{options.quantity}</span>
          <button
            className="quantity-btn"
            onClick={() =>
              handleQuantityChange(product._id, options.quantity, 1)
            }
          >
            <PlusOutlined />
          </button>
        </div>

        <button
          className="remove-btn"
          onClick={() => handleRemoveItem(product._id)}
        >
          <DeleteOutlined />
        </button>
      </div>
    </div>
  );
};

export default BasketItem;
