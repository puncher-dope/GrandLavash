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
        {product.name} {isEditing && "(Редактируется)"}
      </p>

      <p>Категория: {product.categories.substring(0, 100)}</p>

      {product.subcategories && (
        <p>Подкатегория: {product?.subcategories?.substring(0, 100)}</p>
      )}

      <p>Цена: {product.price}</p>
      <p>Объем: {product.volume}</p>
      <p>Доступность: {product.available ? "Да" : "Нет"}</p>
      <p>
        Изображение:
        {isValidImageUrl(product.image) ? (
          <Image
            priority
            src={product.image}
            width={100}
            height={100}
            alt="product image"
          />
        ) : (
          <Image src={'/file.svg'} width={100} height={100} alt="product image" />
        )}
      </p>

      {product.addons?.length !== 0 && product.addons !== undefined && (
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

      {product.removableIngredients?.length !== 0 &&
        product.removableIngredients !== undefined && (
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
  );
};
