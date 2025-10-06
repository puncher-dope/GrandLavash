
import { SUBCATEGORIES_DRINKS } from "@/app/lib/api/constants/product";
import { Select } from "antd";
import './index.scss'

const SelectDrinksSubcategories = () => {
    return (
            <label>
            Подкатегория
            <Select
              className="markdown-edit__input"
              // onChange={(value) => handleInputChange("subcategories", value)}
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
