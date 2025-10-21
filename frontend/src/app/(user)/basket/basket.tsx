// basket.tsx
import { useBasketStore } from "@/app/lib/api/store/useBasketStore";
import "./basket.scss";
import { formatAddons } from "@/app/lib/utils/formatAddons";
import BasketItem from "./components/basketItem/basketItem";
import { formatRemovedIngredients } from "@/app/lib/utils/formatRemovableIngredients";
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
  const {user} = useUser()
  const router = useRouter()

  const totalPrice = getTotalPrice();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if(!user) {
      router.push('/?user-auth=login')
      return
    }

    try {
      // Подготавливаем все товары для отправки
      const basketItems = items.map(({ product, options }) => {
        const selectedAddons = options.addons
          ? Object.entries(options.addons).flatMap(
              ([addonId, addonItems]) => {
                if (!addonItems || !Array.isArray(addonItems)) return [];
                return addonItems.map((addonItem) => ({
                  addonId: addonId,
                  quantity: addonItem.quantity || 1,
                }));
              }
            )
          : [];

        const removedIngredientIds = options.removedIngredients
          ? options.removedIngredients.map((ingredient) => ingredient._id)
          : [];

        return {
          productId: product._id,
          quantity: options.quantity,
          selectedAddons: selectedAddons,
          removedIngredientIds: removedIngredientIds,
        };
      });

      // Отправляем все товары одним запросом
      const { data, error } = await request(BASKET, "POST", {
        items: basketItems
      });

      if (error) {
        throw error;
      }

      console.log('Basket sent successfully:', data);
      
      // ✅ После успешной отправки корзины открываем модальное окно
      setIsCheckoutModalOpen(true);
      
    } catch (error) {
      console.error('Error sending basket:', error);
    } 
  };

  // ✅ Функция для закрытия модального окна
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
          const addonsList = formatAddons(options.addons);
          const removedIngredientsList = formatRemovedIngredients(
            options.removedIngredients
          );

          const itemKey = `${product._id}-${JSON.stringify(options)}`;

          return (
            <BasketItem
              key={itemKey}
              product={product}
              options={options}
              removedIngredientsList={removedIngredientsList}
              addonsList={addonsList}
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