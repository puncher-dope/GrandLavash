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
    const basket = await Basket.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product",
    });

    if (!basket?.items?.length) {
      return res.status(400).json("Корзина пуста");
    }

    const orderItems = basket.items.map((item) => {
      const product:any = item.productId;

      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      };
    });

    const totalPrice = orderItems.reduce((sum, item) => {
      const base = item.price * item.quantity;
      return sum + base;
    }, 0);

    const orderData: any = {
      userId,
      items: orderItems,
      address: address || {},
      paymentMethod: paymentMethod || "card",
      totalPrice,
      status: "pending",
    };

    if (phone) {
      orderData.phone = phone;
    }

    const order = await Order.create(orderData);

    await sendOrderNotification(order);

    await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });

    await Basket.deleteOne({ userId });

    res.status(201).json(order);
  } catch (e) {
    console.error('❌ Error creating order:', e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
