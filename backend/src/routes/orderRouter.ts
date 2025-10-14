import express, { Response } from 'express'
const router = express.Router({ mergeParams: true });
import {Basket} from "../models/Basket"
import {User} from "../models/User"
import {Order} from "../models/Order"
import {sendOrderNotification} from '../telegram/notificationBot'
import { editOrder } from"../controllers/order"
import { AuthRequest } from '../types/authAdminRequest';
import userAuthenticated from '../middlewares/userAuthenticated';

// Получение всех заказов
router.get("/",userAuthenticated, async (req:AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Получение одного заказа
router.get("/:id",userAuthenticated, async (req:AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!order) {
      return res.status(404).json({ error: "Заказ не найден" });
    }
    res.json(order);
  } catch (e) {
    return res.status(400).json({ error: "Заказ не найден" });
  }
});

//редактирование заказа
router.patch("/:id", userAuthenticated,async (req:AuthRequest, res: Response) => {
  try {
    const { error } = await editOrder(req.params.id, req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    res.status(200).json("Статус заказа успешно обновлен");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Создание заказа
router.post("/",userAuthenticated, async (req:AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { address, paymentMethod, phone } = req.body;

    console.log('📨 Received order data:', req.body); // Добавьте это для отладки

    // Получаем корзину с populate
    const basket = await Basket.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product",
    });

    if (!basket?.items?.length) {
      return res.status(400).json("Корзина пуста");
    }

    // Формируем items для заказа
    const orderItems = basket.items.map((item) => {
      const product:any = item.productId;

      // Получаем полные данные допов
      const addons = item.selectedAddons.map((addon:any) => {
        const productAddon = product.addons.find((a) => a._id.equals(addon.addonId));
        return {
          addonId: productAddon._id,
          name: productAddon.name,
          price: productAddon.price,
          quantity: addon.quantity,
        };
      });

      // Получаем убранные ингредиенты
      const removedIngredients = item.removedIngredientIds.map((id) => {
        const ing = product.removableIngredients.find((ri) => ri._id.equals(id));
        return {
          _id: ing._id,
          name: ing.name || 'Неизвестный ингредиент',
        };
      });

      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        selectedAddons: addons,
        removedIngredients: removedIngredients,
        comment: item.comment || "",
      };
    });

    // Расчет общей суммы
    const totalPrice = orderItems.reduce((sum, item) => {
      const base = item.price * item.quantity;
      const addonsSum = item.selectedAddons.reduce(
        (s, a) => s + a.price * a.quantity,
        0
      );
      return sum + base + addonsSum;
    }, 0);

    // Создаем заказ - убираем phone если его нет
    const orderData: any = {
      userId,
      items: orderItems,
      address: address || {}, // Защита от undefined
      paymentMethod: paymentMethod || "card", // Значение по умолчанию
      totalPrice,
      status: "pending",
    };

    // Добавляем phone только если он есть
    if (phone) {
      orderData.phone = phone;
    }

    const order = await Order.create(orderData);

    console.log('✅ Created order:', order); // Добавьте это

    await sendOrderNotification(order);

    await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });

    // Очищаем корзину
    await Basket.deleteOne({ userId });

    res.status(201).json(order);
  } catch (e) {
    console.error('❌ Error creating order:', e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
