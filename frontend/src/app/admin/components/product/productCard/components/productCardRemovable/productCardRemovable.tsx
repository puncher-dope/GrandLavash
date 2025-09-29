import { ProductType } from '@/app/lib/types/productsContextType';
import React from 'react';

const ProductCardRemovable = ({product}: {product : ProductType}) => {
    return (
        <div className="product-card__removable-ingredients">
            <p style={{ fontWeight: '600', color: '#7f1d1d' }}>🚫 Можно убрать:</p>
            {product.removableIngredients!.map((removable, index) => (
              <div key={index}>
                <p>❌ {removable.name}</p>
                <hr />
              </div>
            ))}
          </div>
    );
}

export default ProductCardRemovable;
