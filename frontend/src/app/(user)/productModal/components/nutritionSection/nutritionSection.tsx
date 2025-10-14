import React from "react";

const NutritionSection = () => {
  return (
    <div className="product-modal__nutrition">
      <h4 className="product-modal__nutrition-title">
        Пищевая ценность на 100 грамм *
      </h4>
      <div className="product-modal__nutrition-grid">
        <div className="product-modal__nutrition-item">
          <span className="product-modal__nutrition-value">117.70</span>
          <span className="product-modal__nutrition-label">ККал</span>
        </div>
        <div className="product-modal__nutrition-item">
          <span className="product-modal__nutrition-value">2.70</span>
          <span className="product-modal__nutrition-label">Белки</span>
        </div>
        <div className="product-modal__nutrition-item">
          <span className="product-modal__nutrition-value">21.20</span>
          <span className="product-modal__nutrition-label">Углеводы</span>
        </div>
        <div className="product-modal__nutrition-item">
          <span className="product-modal__nutrition-value">2.50</span>
          <span className="product-modal__nutrition-label">Жиры</span>
        </div>
      </div>
    </div>
  );
};

export default NutritionSection;
