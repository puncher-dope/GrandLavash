import { CATEGORIES } from "@/app/shared/api/constants/product";
import { Card, Input, InputNumber, Select, Switch } from "antd";
import SelectDrinksSubcategories from "../selectDrinksSubcategories/selectDrinksSubcategories";
import SelectSizeSubcategories from "../selectSizeSubcategories/selectSizeSubcategories";
import { HandleInputChange, ProductData } from "@/app/shared/types/productEditorType";
import { useProducts } from "@/app/admin/context/productContext/productsContext";

export type CardEditProps = {
  handleInputChange: HandleInputChange;
}

const MainCardEdit = ({ handleInputChange}: CardEditProps) => {
    const {editedData} = useProducts()
    return (
        <Card
        title="Основная информация"
        size="small"
        className="markdown-edit__section"
      >
        <label>
          Название продукта
          <Input
            className="markdown-edit__input"
            placeholder="Название продукта"
            value={editedData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </label>

        <label>
          Категория
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
        ) :
        (
          <SelectSizeSubcategories handleInputChange={handleInputChange} />
        )
        }



        <label>Цена
        <InputNumber
          className="markdown-edit__input"
          placeholder="Цена"
          value={editedData.price}
          onChange={(value) => handleInputChange("price", value || 0)}
          style={{ width: "100%" }}
          min={0}
        />
        </label>




        <label>Объем/Вес  
        <Input
          className="markdown-edit__input"
          placeholder="Объем"
          value={editedData.volume}
          onChange={(e) => handleInputChange("volume", e.target.value)}
        />
        </label>


        <label>ССылка на изображения
        <Input
          className="markdown-edit__input"
          placeholder="URL изображения"
          value={editedData.image}
          onChange={(e) => handleInputChange("image", e.target.value)}
        />
        </label>



        <div className="markdown-edit__switch">
          <span>Доступен:</span>
          <Switch
            checked={editedData.available}
            onChange={(checked) => handleInputChange("available", checked)}
          />
        </div>
      </Card>
    );
}

export default MainCardEdit;
