
import { CATEGORIES } from "@/app/lib/api/constants/product";
import { Card, Input, InputNumber, Select, Switch } from "antd";
import SelectDrinksSubcategories from "../selectDrinksSubcategories/selectDrinksSubcategories";
import SelectSizeSubcategories from "../selectSizeSubcategories/selectSizeSubcategories";
import { HandleInputChange } from "@/app/lib/types/productEditorType";
import { useProducts } from "@/app/admin/context/productContext/productsContext";
import ImageUpload from "../imageUpload/imageUploud";


export type CardEditProps = {
  handleInputChange: HandleInputChange;
}

const MainCardEdit = ({ handleInputChange }: CardEditProps) => {
  const { editedData } = useProducts();
  
  return (
    <Card
      title="📋 Основная информация"
      size="small"
      className="markdown-edit__section"
    >
      <label className="markdown-edit__label">
        🏷️ Название продукта
        <Input
          className="markdown-edit__input"
          placeholder="Введите название продукта"
          value={editedData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
      </label>

      <label className="markdown-edit__label">
        📂 Категория
        <Select
          className="markdown-edit__input"
          placeholder="Выберите категорию"
          value={editedData.categories || undefined}
          onChange={(value) => handleInputChange("categories", value)}
          onBlur={() => handleInputChange("subcategories", '')}
          style={{ width: "100%" }}
          allowClear
          showSearch
          filterOption={(input, option) =>
            option?.label
              ?.toString()
              .toLowerCase()
              .includes(input.toLowerCase()) || false
          }
          options={CATEGORIES.map((category) => ({
            value: category,
            label: category,
          }))}
        />
      </label>

      {editedData.categories === "Напитки" ? (
        <SelectDrinksSubcategories handleInputChange={handleInputChange} />
      ) : (
        <SelectSizeSubcategories handleInputChange={handleInputChange} />
      )}

      <label className="markdown-edit__label">
        💰 Цена
        <InputNumber
          className="markdown-edit__input"
          placeholder="0"
          value={editedData.price}
          onChange={(value) => handleInputChange("price", value || 0)}
          style={{ width: "100%" }}
          min={0}
          addonAfter="₽"
        />
      </label>

      <label className="markdown-edit__label">
        ⚖️ Объем/Вес
        <Input
          className="markdown-edit__input"
          placeholder="Например: 500мл, 300г"
          value={editedData.volume}
          onChange={(e) => handleInputChange("volume", e.target.value)}
        />
      </label>

      <label className="markdown-edit__label">
        ⚖️ Описание
        <textarea
          className="markdown-edit__textarea"
          placeholder="Например: 500мл, 300г"
          value={editedData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </label>

      <label className="markdown-edit__label">
        🖼️ Изображение товара
        <ImageUpload
          value={editedData.image}
          onChange={(value) => handleInputChange("image", value)}
        />
      </label>

      <div className="markdown-edit__switch">
        <span>📦 Доступен для заказа:</span>
        <Switch
          checked={editedData.available}
          onChange={(checked) => handleInputChange("available", checked)}
        />
      </div>
    </Card>
  );
}

export default MainCardEdit;