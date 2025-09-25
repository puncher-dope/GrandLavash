import { MarkDownProps } from "@/app/shared/types/markdownPropsType";
import { Button, Input, InputNumber, Switch, Card, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import React from "react";
import './index.scss'

const MarkdownEdit = ({
  editedData,
  handleInputChange,
  handleSave,
  setIsEditing,
}: MarkDownProps) => {
  
  // Функции для работы с дополнениями
  const handleAddAddon = () => {
    const newAddon = {
      name: "",
      price: 0,
      required: false,
      maxQuantity: 1
    };
    const updatedAddons = [...editedData.addons, newAddon];
    handleInputChange("addons", updatedAddons);
  };

  const handleRemoveAddon = (index: number) => {
    const updatedAddons = editedData.addons.filter((_, i) => i !== index);
    handleInputChange("addons", updatedAddons);
  };

  const handleAddonChange = (index: number, field: keyof typeof editedData.addons[0], value: string | number | boolean) => {
    const updatedAddons = editedData.addons.map((addon, i) => 
      i === index ? { ...addon, [field]: value } : addon
    );
    handleInputChange("addons", updatedAddons);
  };

  // Функции для работы с удаляемыми ингредиентами
  const handleAddRemovableIngredient = () => {
    const newIngredient = { name: "" };
    const updatedIngredients = [...editedData.removableIngredients, newIngredient];
    handleInputChange("removableIngredients", updatedIngredients);
  };

  const handleRemoveRemovableIngredient = (index: number) => {
    const updatedIngredients = editedData.removableIngredients.filter((_, i) => i !== index);
    handleInputChange("removableIngredients", updatedIngredients);
  };

  const handleRemovableIngredientChange = (index: number, value: string) => {
    const updatedIngredients = editedData.removableIngredients.map((ingredient, i) => 
      i === index ? { ...ingredient, name: value } : ingredient
    );
    handleInputChange("removableIngredients", updatedIngredients);
  };

  return (
    <div className="markdown-edit">
      <h3 className="markdown-edit__title">Редактирование продукта</h3>
      
      {/* Основная информация о продукте */}
      <Card title="Основная информация" size="small" className="markdown-edit__section">
        <Input
          className="markdown-edit__input"
          placeholder="Название продукта"
          value={editedData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
        
        <Input
          className="markdown-edit__input"
          placeholder="Категории"
          value={editedData.categories}
          onChange={(e) => handleInputChange("categories", e.target.value)}
        />
        
        <Input
          className="markdown-edit__input"
          placeholder="Подкатегории"
          value={editedData.subcategories ? editedData.subcategories : ''}
          onChange={(e) => handleInputChange("subcategories", e.target.value)}
        />
        
        <InputNumber
          className="markdown-edit__input"
          placeholder="Цена"
          value={editedData.price}
          onChange={(value) => handleInputChange("price", value || 0)}
          style={{ width: '100%' }}
          min={0}
        />
        
        <Input
          className="markdown-edit__input"
          placeholder="Объем"
          value={editedData.volume}
          onChange={(e) => handleInputChange("volume", e.target.value)}
        />
        
        <Input
          className="markdown-edit__input"
          placeholder="URL изображения"
          value={editedData.image}
          onChange={(e) => handleInputChange("image", e.target.value)}
        />
        
        <div className="markdown-edit__switch">
          <span>Доступен:</span>
          <Switch
            checked={editedData.available}
            onChange={(checked) => handleInputChange("available", checked)}
          />
        </div>
      </Card>

      {/* Дополнения */}
      <Card 
        title="Дополнения" 
        size="small" 
        className="markdown-edit__section"
        extra={
          <Button 
            type="dashed" 
            icon={<PlusOutlined />} 
            onClick={handleAddAddon}
            size="small"
          >
            Добавить дополнение
          </Button>
        }
      >
        {editedData.addons.length === 0 ? (
          <p className="markdown-edit__empty">Дополнения не добавлены</p>
        ) : (
          editedData.addons.map((addon, index) => (
            <Card 
              key={index} 
              size="small" 
              className="markdown-edit__subcard"
              title={`Дополнение ${index + 1}`}
              extra={
                <Button 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={() => handleRemoveAddon(index)}
                  size="small"
                />
              }
            >
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <Input
                  placeholder="Название дополнения"
                  value={addon.name}
                  onChange={(e) => handleAddonChange(index, "name", e.target.value)}
                />
                <InputNumber
                  placeholder="Цена дополнения"
                  value={addon.price}
                  onChange={(value) => handleAddonChange(index, "price", value || 0)}
                  style={{ width: '100%' }}
                  min={0}
                />
                <div className="markdown-edit__switch">
                  <span>Обязательное:</span>
                  <Switch
                    checked={addon.required}
                    onChange={(checked) => handleAddonChange(index, "required", checked)}
                  />
                </div>
                <InputNumber
                  placeholder="Максимальное количество"
                  value={addon.maxQuantity}
                  onChange={(value) => handleAddonChange(index, "maxQuantity", value || 1)}
                  style={{ width: '100%' }}
                  min={1}
                />
              </Space>
            </Card>
          ))
        )}
      </Card>

      {/* Удаляемые ингредиенты */}
      <Card 
        title="Удаляемые ингредиенты" 
        size="small" 
        className="markdown-edit__section"
        extra={
          <Button 
            type="dashed" 
            icon={<PlusOutlined />} 
            onClick={handleAddRemovableIngredient}
            size="small"
          >
            Добавить ингредиент
          </Button>
        }
      >
        {editedData.removableIngredients.length === 0 ? (
          <p className="markdown-edit__empty">Ингредиенты не добавлены</p>
        ) : (
          editedData.removableIngredients.map((ingredient, index) => (
            <div key={index} className="markdown-edit__ingredient-item">
              <Input
                placeholder="Название ингредиента"
                value={ingredient.name}
                onChange={(e) => handleRemovableIngredientChange(index, e.target.value)}
                addonAfter={
                  <Button 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => handleRemoveRemovableIngredient(index)}
                    size="small"
                  />
                }
              />
            </div>
          ))
        )}
      </Card>

      {/* Описание */}
      <Card title="Описание" size="small" className="markdown-edit__section">
        <textarea
          className="markdown-edit__textarea"
          placeholder="Описание продукта (markdown)"
          value={editedData.categories}
          onChange={(e) => handleInputChange("categories", e.target.value)}
        />
      </Card>
      
      {/* Кнопки действий */}
      <div className="markdown-edit__buttons">
        <Button
          type="primary"
          onClick={handleSave}
          className="markdown-edit__button markdown-edit__button--save"
        >
          Сохранить
        </Button>
        <Button
          onClick={() => setIsEditing(false)}
          className="markdown-edit__button markdown-edit__button--cancel"
        >
          Отмена
        </Button>
      </div>
    </div>
  );
};

export default MarkdownEdit;