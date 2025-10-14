import { Button, Checkbox, Space } from 'antd';
import React from 'react';
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { AddonSectionsT, useBasket } from '@/app/lib/api/store/useBasket';

const AddonSection = ({addon}: {addon: AddonSectionsT }) => {
    const {handleCheckboxAddonChange, isAddonSelected, getAddonQuantity, handleAddonQuantityChange} = useBasket()
    return (
        <div key={addon.id} className="product-modal__addon-section">
              <div className="product-modal__addon-header">
                <h3 className="product-modal__addon-title">
                  {addon.name}
                  {addon.required && (
                    <span className="product-modal__required"> *</span>
                  )}
                </h3>
                {addon.maxSelection > 1 && (
                  <p className="product-modal__addon-max">
                    Максимум: {addon.maxSelection}
                  </p>
                )}
              </div>

              <div className="product-modal__addon-options">
                {/* // Необязательные аддоны с счетчиком */}
                <Space direction="vertical" style={{ width: "100%" }}>
                  {addon.options.map((option) => {
                    const isSelected = isAddonSelected(addon.id, option.name);
                    const currentQuantity = getAddonQuantity(
                      addon.id,
                      option.name
                    );
                    const maxQuantity = addon.maxSelection;

                    return (
                      <div
                        key={option.id}
                        className="product-modal__option-with-counter"
                      >
                        <div className="product-modal__option-checkbox">
                          <Checkbox
                            checked={isSelected}
                            onChange={(e) =>
                              handleCheckboxAddonChange(
                                addon.id,
                                option.name,
                                e.target.checked,
                                option.price
                              )
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
                        </div>

                        {/* Счетчик для аддона */}
                        {isSelected && maxQuantity > 1 && (
                          <div className="product-modal__addon-quantity">
                            <Button
                              icon={<MinusOutlined />}
                              onClick={() =>
                                handleAddonQuantityChange(
                                  addon.id,
                                  option.name,
                                  Math.max(1, currentQuantity - 1)
                                )
                              }
                              className="product-modal__addon-quantity-btn"
                              disabled={currentQuantity <= 1}
                            />
                            <span className="product-modal__addon-quantity-value">
                              {currentQuantity}
                            </span>
                            <Button
                              icon={<PlusOutlined />}
                              onClick={() =>
                                handleAddonQuantityChange(
                                  addon.id,
                                  option.name,
                                  Math.min(maxQuantity, currentQuantity + 1)
                                )
                              }
                              className="product-modal__addon-quantity-btn"
                              disabled={currentQuantity >= maxQuantity}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </Space>
              </div>
            </div>
    );
}

export default AddonSection;
