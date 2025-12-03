import { useBasketStore } from "@/app/lib/api/store/useBasketStore";
import { CartItemOptions } from "@/app/lib/types/cartTypes";
import { ProductType } from "@/app/lib/types/productsContextType";

import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import React from "react";

type BasketItemProps = {
    product: ProductType,
    options: CartItemOptions
}

const BasketItem = ({
    product,
    options,
}: BasketItemProps) => {
    const { removeItems, updateQuantity } = useBasketStore();

    const itemId = `${product._id}`;

    const handleQuantityChange = (currentQuantity: number, change: number) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) {
            removeItems(itemId);
        } else {
            updateQuantity(itemId, newQuantity);
        }
    };

    const handleRemoveItem = () => {
        removeItems(itemId);
    };

    return (
        <div
            key={itemId} 
            className="basket-item"
        >
            <div className="basket-item__info">
                <h3 className="basket-item__name">{product.name}</h3>

                {product.description && (
                    <p className="basket-item__description">
                        {product.description.length > 60
                            ? `${product.description.substring(0, 60)}...`
                            : product.description}
                    </p>
                )}

                <div className="basket-item__price">
                    {options.totalPrice || product.price} ₽
                </div>
            </div>

            <div className="basket-item__controls">
                <div className="quantity-controls">
                    <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(options.quantity, -1)}
                    >
                        <MinusOutlined />
                    </button>
                    <span className="quantity-display">{options.quantity}</span>
                    <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(options.quantity, 1)}
                    >
                        <PlusOutlined />
                    </button>
                </div>

                <button
                    className="remove-btn"
                    onClick={handleRemoveItem}
                >
                    <DeleteOutlined />
                </button>
            </div>
        </div>
    );
};

export default BasketItem;