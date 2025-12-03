                      
import { useBasketStore } from "@/app/lib/api/store/useBasketStore";
import "./basket.scss";
import BasketItem from "./components/basketItem/basketItem";
import BasketEmpty from "./components/basketEmpty/basketEmpty";
import { BASKET } from "@/app/lib/api/constants/api";
import { request } from "@/app/lib/api/store/hooks/request";
import { CheckoutModal } from "./components/checkoutModal/checkoutModal";
import { useState } from "react";
import { useUser } from "@/app/lib/api/store/useUser";
import { useRouter } from "next/navigation";

export const Basket = () => {
  const { items, getTotalPrice } = useBasketStore();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const totalPrice = getTotalPrice();

  const handleCheckout = async () => {
    if (items.length === 0) return;

    if(!user){
      router.push("/?user-auth=login")
    }

    try {
      const basketItems = items.map(({ product, options }) => {
          return {
          productId: product._id,
          quantity: options.quantity
        };
      });

      const { data, error } = await request(BASKET, "POST", {
        items: basketItems,
      });

      if (error) {
        throw error;
      }
      console.log("Basket sent successfully:", data);
      setIsCheckoutModalOpen(true);
    } catch (error) {
      console.error("Error sending basket:", error);
    }
    
  };

  const handleCloseCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
  };

  if (items.length === 0) {
    return <BasketEmpty />;
  }

  return (
    <div className="basket">
      <div className="basket__header">
        <h2 className="basket__title">Ваш заказ</h2>
        <span className="basket__count">{items.length} товара</span>
      </div>

      <div className="basket__items">
        {items.map(({ product, options }) => {
          const itemKey = `${product._id}-${JSON.stringify(options)}`;

          return (
            <BasketItem
              key={itemKey}
              product={product}
              options={options}
            />
          );
        })}
      </div>

      <div className="basket__footer">
        <div className="basket__total">
          <span className="basket__total-label">Итого:</span>
          <span className="basket__total-price">{totalPrice} ₽</span>
        </div>

        <button
          className="basket__checkout-btn"
          onClick={handleCheckout}
          disabled={items.length === 0}
        >
          Перейти к оформлению
        </button>
      </div>

      {/* ✅ Добавьте модальное окно */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={handleCloseCheckoutModal}
      />
    </div>
  );
};
