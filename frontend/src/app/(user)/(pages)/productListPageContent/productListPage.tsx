import React from "react";
import ProductList from "../productList/productList";
import './index.scss'

export const ProductsListPageContent: React.FC = () => {
  return (
    <div className="product-list-page">
      <ProductList/>
    </div>
  );
};