import { RemovableIngredientsT, useBasket } from "@/app/lib/api/store/useBasket";
import { Checkbox, Space } from "antd";
import React from "react";

const RemoveSection = ({removableIngredients}:{removableIngredients:RemovableIngredientsT[]}) => {
  const {handleRemovableChange, removedIngredients} = useBasket()
    return (
    <div className="product-modal__removable-section">
      <div className="product-modal__addon-header">
        <h3 className="product-modal__addon-title">
          В БЛЮДО НЕ ДОБАВЛЯТЬ ({removableIngredients.length} на выбор)
        </h3>
      </div>

      <div className="product-modal__removable-options">
        <Space direction="vertical" style={{ width: "100%" }}>
          {removableIngredients.map((ingredient) => (
            <Checkbox
              key={ingredient.id}
              checked={removedIngredients.includes(ingredient.name)}
              onChange={(e) =>
                handleRemovableChange(ingredient.name, e.target.checked)
              }
              className="product-modal__removable-option"
            >
              <span className="product-modal__removable-name">
                {ingredient.name}
              </span>
            </Checkbox>
          ))}
        </Space>
      </div>
    </div>
  );
};

export default RemoveSection;
