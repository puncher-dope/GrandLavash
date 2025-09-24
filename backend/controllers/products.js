const Product = require("../models/Product");

//get all
async function getAllProducts() {
  try {
    const products = await Product.find();

    if(!products){
        throw new Error('Товары не найдены')
    }
    return {
        error:null,
        products
    };
  } catch (e) {
    return {error: e.message || "Неизвестная ошибка"}
  }
}

//get by ID
async function getProductById(productId) {
    try{
        const product = await Product.findById(productId)
        if(!product){
            throw new Error('Товар не найден')
        }
    return {
        error:null,
        product
    }
    }catch(e){
        return{
            error: e.message || "Неизвестная ошибка"
        }
    }
}

async function editProduct(productId, productData) {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return { error: "Товар не найден" };
        }

        // Обновляем только переданные поля, сохраняя существующие допы
        const updateData = {
            name: productData.name ?? product.name,
            price: productData.price ?? product.price,
            // ... другие поля ...
        };

        // Обработка допов (если переданы в запросе)
        if (productData.addons) {
            updateData.addons = productData.addons.map(newAddon => {
                // Если у допа есть _id - обновляем существующий
                const existingAddon = product.addons.id(newAddon._id);
                if (existingAddon) {
                    return { ...existingAddon.toObject(), ...newAddon };
                }
                // Иначе создаём новый (с автоматическим _id)
                return newAddon;
            });
        }

        // Аналогично для removableIngredients
        if (productData.removableIngredients) {
            updateData.removableIngredients = productData.removableIngredients.map(newIng => {
                const existingIng = product.removableIngredients.id(newIng._id);
                return existingIng ? { ...existingIng.toObject(), ...newIng } : newIng;
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true, runValidators: true }
        );

        return { error: null, product: updatedProduct };
    } catch (e) {
        return { error: e.message || "Неизвестная ошибка" };
    }
}

async function deleteProduct(productId) {
    try{
        const deletedProduct = await Product.findByIdAndDelete(productId)
        if(!deletedProduct){
            return { error: "Товар не найден" };
        }

    return {error:null, product: deleteProduct}
    }catch(e){
        return { error: e.message || "Неизвестная ошибка" };
    }
}

module.exports ={
    getAllProducts,
    getProductById,
    editProduct,
    deleteProduct
}