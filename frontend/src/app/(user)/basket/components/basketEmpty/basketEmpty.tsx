import React from "react";

const BasketEmpty = () => {
  return (
    <div className="basket">
      <div className="basket__header">
        <h2 className="basket__title">Корзина</h2>
      </div>
      <div className="basket__empty">
        <div className="basket__empty-icon">🛒</div>
        <p className="basket__empty-text">Корзина пуста</p>
        <span className="basket__empty-subtext">Добавьте товары из меню</span>
      </div>
    </div>
  );
};

export default BasketEmpty;
