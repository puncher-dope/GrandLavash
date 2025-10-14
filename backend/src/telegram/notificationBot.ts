require("dotenv").config();
import TelegramBot from "node-telegram-bot-api";
import { User } from "../models/User";
const tokenBot = process.env.TELEGRAM_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(tokenBot, { polling: true });

export const sendOrderNotification = async (order) => {
  try {
    const user = await User.findById(order.userId);

    // Формируем список товаров с допами и ингредиентами
    const itemsDetails = order.items
      .map((item) => {
        // Допы с количеством и ценой
        const addonsList =
          item.selectedAddons
            .map(
              (addon) =>
                `├─ ${addon.name} (${addon.quantity} x ${addon.price} руб.)`
            )
            .join("\n") || "└─ Без допов";

        // Удаленные ингредиенты
        const removedList =
          item.removedIngredients
            .map((ing) => `├─ Не добавлять: ${ing.name}`)
            .join("\n") || "└─ Все ингредиенты";

        return `
🍔 ${item.name} (${item.quantity} x ${item.price} руб.)
${addonsList}
${removedList}
🔄 Итого за позицию: ${
          item.price * item.quantity +
          item.selectedAddons.reduce((sum, a) => sum + a.price * a.quantity, 0)
        } руб.
            `;
      })
      .join("\n------------------------\n");

    const message = `
🚀 Новый заказ #${order._id}
👤 Клиент: ${user.login} (${user.phone})
📦 Адрес: ${order.address.street}, кв. ${order.address.flat}, этаж ${order.address.floor}

${itemsDetails}

💰 Общая сумма: ${order.totalPrice} руб.
💳 Способ оплаты: ${order.paymentMethod}
📝 Статус: ${order.status}
        `;

    await bot.sendMessage(chatId, message, { parse_mode: "HTML" });
    console.log("Уведомление отправлено в Telegram");
  } catch (e) {
    console.error("Ошибка отправки в Telegram:", e.message);
  }
};
