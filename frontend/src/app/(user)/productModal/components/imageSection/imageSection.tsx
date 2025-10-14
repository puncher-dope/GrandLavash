import { ProductType } from "@/app/lib/types/productsContextType";
import Image from "next/image";
import React from "react";

const ImageSection = ({product}: {product:ProductType}) => {
  return (
    <div className="product-modal__image-section">
      {product.image ? (
        <Image
          src={product.image || ""}
          alt={product.name}
          className="product-modal__image"
          width={600}
          height={600}
          priority
        />
      ) : (
        <div className="product-modal__image-placeholder">
          <span>Изображение товара</span>
        </div>
      )}
    </div>
  );
};

export default ImageSection;
