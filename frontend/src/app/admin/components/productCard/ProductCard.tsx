import { ProductType } from "@/app/shared/types/productsContextType";
import './index.scss'


export type ProductProps = {
  product: ProductType;
  isEditing?: boolean;
};

export const ProductCard: React.FC<ProductProps> = ({ product, isEditing }) => {
  return (
    <div className="product-card">
      <p style={{ fontWeight: "bold" }}>
        {product.name} {isEditing && "(Редактируется)"}
      </p>

      <p>Категория: {product.categories.substring(0, 100)}...</p>

      {product.subcategories && (
        <p>Субкатегория: {product?.subcategories?.substring(0, 100)}...</p>
      )}

      <p>Цена: {product.price}</p>
      <p>Объем: {product.volume}</p>
      <p>Доступность: {product.available ? "Да" : "Нет"}</p>
      <p>Изображение: {product.image}</p>

      {product.addons?.length !==0 &&product.addons !== undefined  && (
        <div className="product-card__addons">
          <p>Дополнения:</p>
          {product.addons.map((addon, index) => (
            <div key={index}>
              <p>Название: {addon.name}</p>
              <p>Цена: {addon.price}</p>
              <p>Обязательное: {addon.required ? "Да" : "Нет"}</p>
              <p>Максимальное количество: {addon.maxQuantity}</p>
              <hr />
            </div>
          ))}
        </div>
      )}

      {product.removableIngredients?.length !==0 &&product.removableIngredients !== undefined  && (
        <div className="product-card__removable-ingredients">
          <p>Можно убрать:</p>
          {product.removableIngredients.map((removable, index) => (
            <div key={index}>
              <p>Название: {removable.name}</p>
              <hr />
            </div>
          ))}
        </div>
      )}

    </div>
)}