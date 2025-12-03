import express, { Response } from "express";
const router = express.Router();
import { Basket } from "../models/Basket";
import { Product } from "../models/Product";
import { deleteBasket } from "../controllers/basket";
import { AuthRequest } from "../types/authAdminRequest";
import userAuthenticated from "../middlewares/userAuthenticated";

router.get("/",userAuthenticated, async (req: AuthRequest, res: Response) => {
  try {
    const basket = (await Basket.findOne({ userId: req.user.id }).populate({
      path: "items.productId",
      model: "Product",
    }))

    if (!basket) {
      return res.json({ items: [], totalPrice: 0 });
    }

    const enrichedItems = basket.items.map((item) => {
      const product = item.productId as any;

      return {
        productName: product.name,
        productPrice: product.price,
        quantity: item.quantity,
      };
    });

    res.json({
      items: enrichedItems,
      totalPrice: basket.totalPrice,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/",userAuthenticated, async (req: AuthRequest, res: Response) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    const products = await Product.find({
      _id: { $in: items.map((item) => item.productId) },
    });

    let totalPrice = 0;
    const validItems = [];

    for (const item of items) {
      const product = products.find((p) => p._id.equals(item.productId));
      if (!product) continue;

      const basePrice = product.price * item.quantity;

      totalPrice += basePrice;

      validItems.push({
        productId: product._id,
        quantity: item.quantity,
      });
    }

    await Basket.updateOne(
      { userId },
      { $set: { items: validItems, totalPrice } },
      { upsert: true }
    );

    const populatedItems = validItems.map((item) => {
      const product = products.find((p) => p._id.equals(item.productId));
      return {
        ...item,
        productName: product.name,
        productPrice: product.price,
      };
    });

    res.json({
      message: "Корзина обновлена",
      items: populatedItems,
      totalPrice,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//удаление корзины
router.delete("/",userAuthenticated, async (req: AuthRequest, res: Response) => {
  const userId:any = req.user.id;
  const { error } = await deleteBasket(userId);
  if (error) {
    return res.status(400).send({ error });
  }

  res.send({ message: "Товар удален" });
});

export default router;
