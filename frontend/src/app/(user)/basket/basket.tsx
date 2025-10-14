// basket.tsx
import { useBasketStore } from "@/app/lib/api/store/useBasketStore";
import "./basket.scss";
import { formatAddons } from "@/app/lib/utils/formatAddons";
import BasketItem from "./components/basketItem";
import { formatRemovedIngredients } from "@/app/lib/utils/formatRemovableIngredients";
import BasketEmpty from "./components/basketEmpty";

export const Basket = () => {
  const { items, getTotalPrice } =
    useBasketStore();



  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <BasketEmpty/>
    );
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

          return (
            <BasketItem
              key={`${product._id}-${JSON.stringify(options)}`}
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

        <button className="basket__checkout-btn">Перейти к оформлению</button>
      </div>
    </div>
  );
};
