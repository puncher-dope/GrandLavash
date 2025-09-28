import { ProductType } from "@/app/shared/types/productsContextType";
import "./index.scss";
import Image from "next/image";
import { isValidImageUrl } from "@/app/shared/utils/isValidImageUrl";

export type ProductProps = {
  product: ProductType;
  isEditing?: boolean;
};

export const ProductCard: React.FC<ProductProps> = ({ product, isEditing }) => {
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
      <p>
        🖼️ Изображение:
        {isValidImageUrl(product.image) ? (
           <Image
              priority
              src={product.image}
              width={80}
              height={80}
              alt="product image"
              style={{ 
                borderRadius: '8px',
                objectFit: 'cover'
              }}
            />
        ) : (
           <div style={{ marginTop: '8px' }}>
            <Image 
              src={'/file.svg'} 
              width={80} 
              height={80} 
              alt="product image" 
              style={{ 
                borderRadius: '8px',
                opacity: 0.5
              }}
            />
          </div>
        )}
      </p>

      {product.addons?.length !== 0 && product.addons !== undefined && (
        <div className="product-card__addons">
          <p style={{ fontWeight: '600', color: '#065f46' }}>🎯 Дополнения:</p>
          {product.addons.map((addon, index) => (
            <div key={index}>
              <p>📌 {addon.name} - ${addon.price}</p>
              <p>🔸 Обязательное: {addon.required ? "✅ Да" : "➖ Нет"}</p>
              <p>🔢 Макс. количество: {addon.maxQuantity}</p>
              <hr />
            </div>
          ))}
        </div>
      )}

      {product.removableIngredients?.length !== 0 &&
        product.removableIngredients !== undefined && (
           <div className="product-card__removable-ingredients">
            <p style={{ fontWeight: '600', color: '#7f1d1d' }}>🚫 Можно убрать:</p>
            {product.removableIngredients.map((removable, index) => (
              <div key={index}>
                <p>❌ {removable.name}</p>
                <hr />
              </div>
            ))}
          </div>
        )}
    </div>
  );
};
