import { Input } from "antd";
import type React from "react";
import { type SearchInputType } from "@/app/shared/types/markdownPropsType";

export const SearchInput = ({ searchTerm, setSearchTerm }:SearchInputType) => {

return (
       <>
        <Input.Search
            placeholder="Поиск по заголовку или содержимому"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          /> 
       </>
  );
};