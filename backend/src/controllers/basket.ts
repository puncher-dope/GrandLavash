import {Basket} from '../models/Basket'

export async function deleteBasket(userId:string) {
    try{
        const deletedBasket = await Basket.deleteOne({userId})
        
        if (deletedBasket.deletedCount === 0) {
            return { error: "Корзина не найдена" };
        }

    return {error:null}
    }catch(e){
        return { error: e.message || "Неизвестная ошибка" };
    }
}
