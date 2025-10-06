import { useUser } from "@/app/lib/api/store/useUser";
import React, { useEffect } from "react";

const ProductModalPage = () => {
  const { products, fetchProducts } = useUser();
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  return <div>{products?.map((product) => (
  <div key={product._id}>
    <div>{product.name}</div>
  </div>))}</div>;
};

export default ProductModalPage;
