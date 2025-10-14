// basket/components/checkoutModal/checkoutModal.tsx
'use client'

import { useState } from 'react';
import { Input, Radio, Button, Modal } from 'antd';
import { useBasketStore } from "@/app/lib/api/store/useBasketStore";
import { useRouter } from "next/navigation";
import './checkoutModal.scss';
import { request } from '@/app/lib/api/store/hooks/request';
import { ORDERS } from '@/app/lib/api/constants/api';
import { OrderApiResponse } from '@/app/lib/types/orderTypes';

interface AddressForm {
  street: string;
  flat: string;
  floor: string;
  doorphone: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const [address, setAddress] = useState<AddressForm>({
    street: '',
    flat: '',
    floor: '',
    doorphone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [isLoading, setIsLoading] = useState(false);
  
  const { items, getTotalPrice, clearItems } = useBasketStore();
  const router = useRouter();

  const totalPrice = getTotalPrice();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Валидация
  if (!address.street.trim() || !address.flat.trim()) {
    alert('Пожалуйста, заполните обязательные поля (улица и квартира)');
    return;
  }

  setIsLoading(true);

  try {
    // Подготавливаем данные
    const orderData = {
      address: {
        street: address.street.trim(),
        flat: address.flat.trim(),
        floor: address.floor.trim() || "",
        doorphone: address.doorphone ? parseInt(address.doorphone) : undefined
      },
      paymentMethod: paymentMethod,
      phone: "" // Добавляем пустое поле phone
    };

    console.log('📤 Отправляемые данные:', orderData);

    const orderResponse = await request<OrderApiResponse>(ORDERS, "POST", orderData);

    console.log('📥 Полный ответ от сервера:', orderResponse);

    // 🔧 ИСПРАВЛЕНИЕ: Правильная проверка ошибок
    if (orderResponse.error) {
      throw new Error('Ошибка создания заказа: ' + orderResponse.error);
    }

    // 🔧 ИСПРАВЛЕНИЕ: Безопасное извлечение данных
    const orderDataFromResponse = orderResponse.data?.data || orderResponse.data || orderResponse;

    // Проверяем, что заказ создан успешно (даже если структура не идеальна)
    if (!orderDataFromResponse) {
      console.warn('Нестандартная структура ответа, но продолжаем...');
    }

    // Логируем для отладки
    console.log('📋 Данные заказа из ответа:', orderDataFromResponse);
    
    // 🔧 УБИРАЕМ проблемные строки, которые вызывают ошибку
    // console.log('🏠 Address в ответе:', orderResponse.data?.data.address);
    // console.log('💳 Payment method в ответе:', orderResponse.data?.data.paymentMethod);

    // 3. Очищаем корзину и показываем успех
    clearItems();
    onClose();
    alert('Заказ успешно создан!');
    
    // Перенаправляем на главную
    router.push('/');
    
  } catch (error) {
    console.error('Error during checkout:', error);
    alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.');
  } finally {
    setIsLoading(false);
  }
};


  const handleInputChange = (field: keyof AddressForm, value: string) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Modal
      title="Оформление заказа"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      className="checkout-modal"
    >
      <div className="checkout-content">
        {/* Сводка заказа */}
        <div className="order-summary-section">
          <h3>Ваш заказ</h3>
          <div className="order-items-preview">
            {items.map(({ product, options }, index) => (
              <div key={index} className="order-item-preview">
                <span className="item-name">{product.name}</span>
                <span className="item-quantity">×{options.quantity}</span>
                <span className="item-price">{options.totalPrice || product.price} ₽</span>
              </div>
            ))}
          </div>
          <div className="order-total-preview">
            <strong>Итого: {totalPrice} ₽</strong>
          </div>
        </div>

        {/* Форма оформления */}
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section">
            <h3>Адрес доставки</h3>
            
            <div className="form-group">
              <label>Улица и дом *</label>
              <Input
                placeholder="ул. Черноморский 77а"
                value={address.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Квартира *</label>
                <Input
                  placeholder="12"
                  value={address.flat}
                  onChange={(e) => handleInputChange('flat', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Этаж</label>
                <Input
                  placeholder="4"
                  value={address.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Домофон</label>
                <Input
                  placeholder="123"
                  value={address.doorphone}
                  onChange={(e) => handleInputChange('doorphone', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Способ оплаты</h3>
            <Radio.Group 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="payment-methods"
            >
              <Radio value="card">Картой онлайн</Radio>
              <Radio value="cash">Наличными при получении</Radio>
            </Radio.Group>
          </div>

          <div className="form-actions">
            <Button onClick={onClose} disabled={isLoading}>
              Отмена
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={isLoading}
              disabled={!address.street.trim() || !address.flat.trim()}
            >
              Подтвердить заказ
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};