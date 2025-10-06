import {  SUBCATEGORIES_SIZE } from "@/app/lib/api/constants/product";
import { Select } from "antd";
import './index.scss'

const SelectSizeSubcategories = () => {
  return (
    <label>
      Размер
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
        options={SUBCATEGORIES_SIZE.map((size) => ({
          value: size,
          label: size,
        }))}
      />
    </label>
  );
};

export default SelectSizeSubcategories;
