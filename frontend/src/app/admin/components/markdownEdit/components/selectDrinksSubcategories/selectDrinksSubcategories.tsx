
import { SUBCATEGORIES_DRINKS } from "@/app/shared/api/constants/product";
import { HandleInputChangeType } from "@/app/shared/types/productEditorType";
import { Select } from "antd";


const SelectDrinksSubcategories = ({handleInputChange}: HandleInputChangeType) => {
    return (
            <label>
            Подкатегория
            <Select
              className="markdown-edit__input"
              onChange={(value) => handleInputChange("subcategories", value)}
              style={{ width: "100%" }}
              allowClear
              showSearch
              filterOption={(input, option) =>
                option?.label
                  ?.toString()
                  .toLowerCase()
                  .includes(input.toLowerCase()) || false
              }
              options={SUBCATEGORIES_DRINKS.map((drink) => ({
                value: drink,
                label: drink,
              }))}
            />
          </label>
    );
}

export default SelectDrinksSubcategories;
