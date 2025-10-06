import {  SUBCATEGORIES_SIZE } from "@/app/lib/api/constants/product";
import { HandleInputChangeType } from "@/app/lib/types/productEditorType";
import { Select } from "antd";

const SelectSizeSubcategories = ({handleInputChange}: HandleInputChangeType) => {
  return (
    <label>
      Размер
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
        options={SUBCATEGORIES_SIZE.map((size) => ({
          value: size,
          label: size,
        }))}
      />
    </label>
  );
};

export default SelectSizeSubcategories;
