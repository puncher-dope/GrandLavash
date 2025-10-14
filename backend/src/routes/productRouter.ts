import express from "express"
const router = express.Router({ mergeParams: true });
import {
  getAllProducts,
  getProductById,
  editProduct,
  deleteProduct,
} from "../controllers/products"
import {Product} from "../models/Product"
import authenticated from "../middlewares/authenticated"
import hasERole from "../helpers/hasERole"
import {roles} from "../constants/roles"

router.get("/", async (req, res) => {
  const { error, products } = await getAllProducts();

  error
    ? res.status(400).send({ error, products })
    : res.status(200).send({ error, products });
});

router.get("/:id", async (req, res) => {
  const { error, product } = await getProductById(req.params.id);

  error
    ? res.status(400).send({ error, product })
    : res.status(200).send({ error, product });
});

router.post('/', authenticated, hasERole([roles.ADMIN]), async(req, res) => {
  try{
    const product = await Product.create(req.body)
    res.status(201).send(product)
  }catch(e){
    res.status(400).send({error:e.message})
  }
})

router.patch("/:id", authenticated, hasERole([roles.ADMIN]), async (req, res) => {
    const { error, product } = await editProduct(req.params.id, req.body);
    
    if (error) {
        return res.status(400).send({ error });
    }
    
    res.send(product);
});

router.delete("/:id", authenticated, hasERole([roles.ADMIN]), async (req, res) => {
    const {error, product} = await deleteProduct(req.params.id)
    if(error){
        return res.status(400).send({error})
    }

    res.send({message: "Товар удален", product})
})



export default router;
