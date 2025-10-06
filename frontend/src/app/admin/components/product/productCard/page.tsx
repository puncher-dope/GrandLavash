import { ProductType } from "@/app/lib/types/productsContextType";
import "./index.scss";
import Image from "next/image";
import { isValidImageUrl } from "@/app/lib/utils/isValidImageUrl";
import ProductCardAddons from "./components/productCardAddons/page";
import ProductCardRemovable from "./components/productCardRemovable/page";

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
      <p style={{ fontWeight: "bold" }}>
        {product.name} {isEditing && " ✏️"}
      </p>

      <p>🏷️ Категория: {product.categories}</p>

      {product.subcategories && (
        <p>📂 Подкатегория: {product.subcategories}</p>
      )}

      <p>💰 Цена: {product.price}Р</p>
      <p>⚖️ Объем: {product.volume}</p>
      <p>📦 Доступность: {product.available ? "✅ Да" : "❌ Нет"}</p>
      <p>📦 Описание: {product.description ? product.description: 'Нет описания'}</p>
      
      <div className="product-card__image-section">
        <span>🖼️ Изображение:</span>
        <div className="product-card__image-container">
          {isValidImageUrl(product.image) ? (
            <Image
              priority
              src={imageSrc}
              // width={100}
              // height={100}
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
              // width={80} 
              // height={80}
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
        <ProductCardAddons product = {product}/>
      )}

      {product.removableIngredients?.length !== 0 &&
        product.removableIngredients !== undefined && (
           <ProductCardRemovable product={product}/>
        )}
    </div>
  );
};