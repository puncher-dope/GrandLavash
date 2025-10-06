import React from "react";
import MarkdownEdit from "../markdownEdit/page";
import './index.scss'
import { useUser } from "@/app/lib/api/store/useUser";

const ProductEditor = () => {
  const { selectedProduct, isEditing } = useUser();

  if (!selectedProduct) {
    return <div className="product-editor__empty">Выберите товар для просмотра</div>;
  }

  return (
    <div className="product-editor">
      {isEditing && (
        <MarkdownEdit/>
      )}
    </div>
  );
};

export default ProductEditor;