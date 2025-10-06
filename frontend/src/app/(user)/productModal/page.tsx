// components/ProductModal/page.tsx
"use client";
import React, { useState } from "react";
import { Modal, Button, Checkbox, Radio, Space } from "antd";
import { PlusOutlined, MinusOutlined, CloseOutlined } from "@ant-design/icons";
import { ProductType } from "@/app/lib/types/productsContextType";
import "./index.scss";
import { CartItemOptions } from "@/app/lib/types/cartTypes";
import Image from "next/image";

interface ProductModalProps {
  product: ProductType;
  visible: boolean;
  onClose: () => void;
  onAddToCart: (product: ProductType, selectedOptions: CartItemOptions) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  visible,
  onClose,
  onAddToCart,
}) => {
  const [selectedAddons, setSelectedAddons] = useState<
    Record<string, string | string[] | null>
  >({});
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Преобразуем ваши addons в структуру для модалки
  const getAddonSections = () => {
    if (!product.addons || product.addons.length === 0) return [];

    return product.addons.map((addon, index) => ({
      id: `addon-${index}`,
      name: addon.name || `Дополнение ${index + 1}`,
      type: addon.required ? "radio" : ("checkbox" as "radio" | "checkbox"),
      required: addon.required,
      maxSelection: addon.maxQuantity,
      options: [
        {
          id: `option-${index}`,
          name: addon.name || `Опция ${index + 1}`,
          price: addon.price,
          volume: "",
        },
      ],
    }));
  };

  const getRemovableIngredients = () => {
    if (
      !product.removableIngredients ||
      product.removableIngredients.length === 0
    )
      return [];

    return product.removableIngredients.map((ingredient, index) => ({
      id: `removable-${index}`,
      name: ingredient.name,
    }));
  };

  const handleAddonChange = (
    addonId: string,
    optionId: string,
    checked: boolean
  ) => {
    setSelectedAddons((prev) => {
      const addon = getAddonSections().find((a) => a.id === addonId);

      if (addon?.type === "radio") {
        return {
          ...prev,
          [addonId]: checked ? optionId : null,
        };
      } else {
        const current = (prev[addonId] as string[]) || [];
        let updated: string[];

        if (checked) {
          const max = addon?.maxSelection || Infinity;
          updated = current.length < max ? [...current, optionId] : current;
        } else {
          updated = current.filter((id) => id !== optionId);
        }

        return {
          ...prev,
          [addonId]: updated,
        };
      }
    });
  };

  const handleRemovableChange = (ingredientId: string, checked: boolean) => {
    setRemovedIngredients((prev) =>
      checked
        ? [...prev, ingredientId]
        : prev.filter((id) => id !== ingredientId)
    );
  };

  const calculateTotalPrice = (): number => {
    let total = product.price;

    // Добавляем стоимость выбранных аддонов
    Object.values(selectedAddons).forEach((selection) => {
      if (Array.isArray(selection)) {
        selection.forEach((optionId) => {
          const allOptions = getAddonSections().flatMap((a) => a.options);
          const option = allOptions.find((o) => o.id === optionId);
          if (option) total += option.price;
        });
      } else if (selection && typeof selection === "string") {
        const allOptions = getAddonSections().flatMap((a) => a.options);
        const option = allOptions.find((o) => o.id === selection);
        if (option) total += option.price;
      }
    });

    return total * quantity;
  };

  const handleAddToCart = () => {
    const selectedOptions: CartItemOptions = {
      addons: selectedAddons,
      removedIngredients,
      quantity,
      totalPrice: calculateTotalPrice(),
    };

    onAddToCart(product, selectedOptions);
    onClose();
  };

  const addonSections = getAddonSections();
  const removableIngredients = getRemovableIngredients();

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1200}
      className="product-modal"
      closeIcon={<CloseOutlined />}
    >
      <div className="product-modal__content">
        {/* Секция с изображением */}
        <div className="product-modal__image-section">
          {product.image ? (
            <Image
              src={product.image || ''}
              alt={product.name}
              className="product-modal__image"
              width={600}
              height={600}
              priority
            />
          ) : (
            <div className="product-modal__image-placeholder">
              <span>Изображение товара</span>
            </div>
          )}
        </div>

        {/* Секция с информацией */}
        <div className="product-modal__info-section">
          {/* Заголовок и основная информация */}
          <div className="product-modal__header">
            <h2 className="product-modal__title">{product.name}</h2>
            <p className="product-modal__weight">{product.volume}</p>
            <p className="product-modal__description">
              {product.description || "Описание отсутствует"}
            </p>
            <p className="product-modal__note">
              *Блюдо подается теплым, но не горячим
            </p>
          </div>

          {/* Дип соусы и дополнения */}
          {addonSections.map((addon) => (
            <div key={addon.id} className="product-modal__addon-section">
              <div className="product-modal__addon-header">
                <h3 className="product-modal__addon-title">
                  {addon.name}
                  {addon.required && (
                    <span className="product-modal__required"> *</span>
                  )}
                </h3>
              </div>

              <div className="product-modal__addon-options">
                {addon.type === "radio" ? (
                  <Radio.Group
                    value={selectedAddons[addon.id] || null}
                    onChange={(e) =>
                      handleAddonChange(addon.id, e.target.value, true)
                    }
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      {addon.options.map((option) => (
                        <Radio
                          key={option.id}
                          value={option.id}
                          className="product-modal__option"
                        >
                          <div className="product-modal__option-content">
                            <span className="product-modal__option-name">
                              {option.name}
                              {option.volume && (
                                <span className="product-modal__option-volume">
                                  {" "}
                                  {option.volume}
                                </span>
                              )}
                            </span>
                            {option.price > 0 && (
                              <span className="product-modal__option-price">
                                +{option.price} ₽
                              </span>
                            )}
                          </div>
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                ) : (
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {addon.options.map((option) => (
                      <Checkbox
                        key={option.id}
                        checked={(selectedAddons[addon.id] || []).includes(
                          option.id
                        )}
                        onChange={(e) =>
                          handleAddonChange(addon.id, option.id, e.target.checked)
                        }
                        className="product-modal__option"
                      >
                        <div className="product-modal__option-content">
                          <span className="product-modal__option-name">
                            {option.name}
                            {option.volume && (
                              <span className="product-modal__option-volume">
                                {" "}
                                {option.volume}
                              </span>
                            )}
                          </span>
                          {option.price > 0 && (
                            <span className="product-modal__option-price">
                              +{option.price} ₽
                            </span>
                          )}
                        </div>
                      </Checkbox>
                    ))}
                  </Space>
                )}
              </div>
            </div>
          ))}

          {/* Удаляемые ингредиенты */}
          {removableIngredients.length > 0 && (
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
                      checked={removedIngredients.includes(ingredient.id)}
                      onChange={(e) =>
                        handleRemovableChange(ingredient.id, e.target.checked)
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
          )}

          {/* Пищевая ценность */}
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

          {/* Футер с количеством и ценой */}
          <div className="product-modal__footer">
            <div className="product-modal__quantity">
              <Button
                icon={<MinusOutlined />}
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="product-modal__quantity-btn"
              />
              <span className="product-modal__quantity-value">{quantity}</span>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setQuantity((prev) => prev + 1)}
                className="product-modal__quantity-btn"
              />
            </div>

            <Button
              type="primary"
              size="large"
              className="product-modal__add-btn"
              onClick={handleAddToCart}
            >
              Добавить за {calculateTotalPrice()} ₽
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};