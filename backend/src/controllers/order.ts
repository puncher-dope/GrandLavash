import {Order} from '../models/Order'
import { OrderData } from '../types/orderType'


export async function editOrder(orderId:string, orderData: OrderData) {
    try{
        const updateOrder = {
            status: orderData.status,
            paymentMethod: orderData.paymentMethod
        }

        Object.keys(updateOrder).forEach((key) => updateOrder[key] === undefined && delete updateOrder[key])

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            updateOrder,
            {new: true}
        )

        if(!updatedOrder){
            throw new Error("Заказ не найден")
        }

        return {
            error: null,
            order: updatedOrder
        }
    }catch(e){
        return {
            error: e.message || 'Неизвестная ошибка'
        }
    }
}
