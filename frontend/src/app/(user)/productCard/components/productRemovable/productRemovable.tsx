// ProductCard/components/productRemovable/page.tsx
import { ProductType } from '@/app/lib/types/productsContextType';
import React from 'react';
import './index.scss';

const ProductRemovable = ({product}: {product : ProductType}) => {
    return (
        <div className="product-removable">
            <h4 className="product-removable__title">
                <span>🚫</span>
                Можно убрать
            </h4>
            {product.removableIngredients!.map((removable, index) => (
              <div key={index} className="product-removable__item">
                <p className="product-removable__name">
                  ❌ {removable.name}
                </p>
                <hr className="product-removable__divider" />
              </div>
            ))}
          </div>
    );
}

export default ProductRemovable;