// basketLayot.tsx
import { ReactNode, useState } from "react";
import { Basket } from "./basket";
import { useBasketStore } from "@/app/lib/api/store/useBasketStore";
import './basketLayout.scss';

export const BasketLayout = ({children}: {children: ReactNode}) => {
    const [isBasketOpen, setIsBasketOpen] = useState(false);
    const { items, getTotalPrice } = useBasketStore();
    
    const totalItems = items.reduce((sum, item) => sum + item.options.quantity, 0);
    const totalPrice = getTotalPrice();

    return (
        <>
            {children}
            
            {/* Умная кнопка корзины */}
            <div className="smart-basket-btn" onClick={() => setIsBasketOpen(!isBasketOpen)}>
                <div className="basket-icon">🛒</div>
                <div className="basket-info">
                    <div className="basket-total">{totalPrice} ₽</div>
                    <div className="basket-count">{totalItems} шт</div>
                </div>
            </div>

            {isBasketOpen && (
                <>
                    <div className="basket-overlay" onClick={() => setIsBasketOpen(false)} />
                    <div className="basket-fixed-container">
                        <Basket/>
                        <button 
                            className="close-basket-btn"
                            onClick={() => setIsBasketOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                </>
            )}
        </>
    )
}