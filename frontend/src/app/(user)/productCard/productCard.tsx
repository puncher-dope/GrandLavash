// ProductCard/page.tsx (обновленная версия)
import { ProductType } from "@/app/lib/types/productsContextType";
import "./index.scss";
import Image from "next/image";
import { isValidImageUrl } from "@/app/lib/utils/isValidImageUrl";
import ProductAddons from "./components/productAddons/productAddons";
import ProductRemovable from "./components/productRemovable/productRemovable";

export type ProductProps = {
  product: ProductType;
  isEditing?: boolean;
};

export const ProductCard: React.FC<ProductProps> = ({ product, isEditing }) => {
  const getImageSrc = () => {
    if (!product.image) return '/file.svg';
    
    if (product.image.startsWith('data:image/')) {
      return product.image;
    }
    
    return isValidImageUrl(product.image) ? product.image : '/file.svg';
  };

  const imageSrc = getImageSrc();
  const isBase64 = product.image?.startsWith('data:image/');

  return (
    <div className="product-card">
      <div className="product-card__header">
        <h3 className="product-card__title">
          {product.name}
          {isEditing && <span className="product-card__edit-badge">✏️</span>}
        </h3>
      </div>

      <div className="product-card__info">
        <div className="product-card__info-item">
          <span className="product-card__info-label">Категория:</span>
          <span className="product-card__info-value">{product.categories}</span>
        </div>

        {product.subcategories && (
          <div className="product-card__info-item">
            <span className="product-card__info-label">Подкатегория:</span>
            <span className="product-card__info-value">{product.subcategories}</span>
          </div>
        )}

        <div className="product-card__info-item product-card__info-item--price">
          <span className="product-card__info-label">Цена:</span>
          <span className="product-card__price">{product.price}Р</span>
        </div>

        <div className="product-card__info-item">
          <span className="product-card__info-label">Объем:</span>
          <span className="product-card__info-value">{product.volume}</span>
        </div>

        <div className="product-card__info-item">
          <span className="product-card__info-label">Доступность:</span>
          <span className={`product-card__availability ${product.available ? 'available' : 'unavailable'}`}>
            {product.available ? "В наличии" : "Нет в наличии"}
          </span>
        </div>

        <div className="product-card__info-item">
          <span className="product-card__info-label">Описание:</span>
          <span className="product-card__description">
            {product.description || 'Нет описания'}
          </span>
        </div>
      </div>

      <div className="product-card__image-section">
        <span className="product-card__image-label">Изображение:</span>
        <div className="product-card__image-container">
          {isValidImageUrl(product.image) ? (
            <Image
              priority
              src={imageSrc}
              fill
              sizes="(max-width: 768px) 100px, 100px"
              alt="product image"
              className="product-card__image"
              unoptimized={isBase64}
            />
          ) : (
            <Image 
              priority
              src={'/file.svg'} 
              fill 
              sizes="(max-width: 768px) 100px, 100px"
              alt="product image" 
              className="product-card__image product-card__image--placeholder"
              unoptimized={isBase64}
            />
          )}
        </div>
      </div>

      {product.addons?.length !== 0 && product.addons !== undefined && (
        <ProductAddons product={product}/>
      )}

      {product.removableIngredients?.length !== 0 &&
        product.removableIngredients !== undefined && (
          <ProductRemovable product={product}/>
        )}
    </div>
  );
};