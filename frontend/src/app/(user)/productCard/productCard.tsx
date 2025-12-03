
"use client";
import { ProductType } from "@/app/lib/types/productsContextType";
import "./index.scss";
import Image from "next/image";
import { isValidImageUrl } from "@/app/lib/utils/isValidImageUrl";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useBasketStore } from "@/app/lib/api/store/useBasketStore";
import { CartItemOptions } from "@/app/lib/types/cartTypes";

export type ProductProps = {
  product: ProductType;
  isEditing?: boolean;
  onAddToCart?: (product: ProductType) => void;
};

export const ProductCard: React.FC<ProductProps> = ({
  product,
  onAddToCart,
}) => {
  const { addItem } = useBasketStore();
  

  const getImageSrc = () => {
    if (!product.image) return "/file.svg";
    if (product.image.startsWith("data:image/")) return product.image;
    return isValidImageUrl(product.image) ? product.image : "/file.svg";
  };

  const imageSrc = getImageSrc();
  const isBase64 = product.image?.startsWith("data:image/");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const item = {
      product: product,
      options: {
        quantity: 1,
        totalPrice: product.price || 0,
      } as CartItemOptions,
    };

    addItem(item);

    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="product-card">
      <div className="product-card__image-section">
        <div className="product-card__image-container">
          {isValidImageUrl(product.image) ? (
            <Image
              priority
              src={imageSrc}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              alt={product.name}
              className="product-card__image"
              unoptimized={isBase64}
            />
          ) : (
            <Image
              priority
              src={"/file.svg"}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              alt={product.name}
              className="product-card__image product-card__image--placeholder"
              unoptimized={isBase64}
            />
          )}
        </div>
      </div>

      <div className="product-card__content">
        <div className="product-card__top">
          <h3 className="product-card__title">{product.name}</h3>
          <span className="product-card__price">{product.price || 0} ₽</span>
        </div>
        
        <div className="product-card__bottom">
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={handleAddToCart}
            className="product-card__add-btn"
          />
        </div>
      </div>
    </div>
  );
};