const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getAllProducts,
  getProductById,
  editProduct,
  deleteProduct,
} = require("../controllers/products");
const Product = require("../models/Product");
const authenticated = require("../middlewares/authenticated");
const hasERole = require("../helpers/hasERole");
const ROLES = require("../constants/roles");

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

router.post('/', authenticated, hasERole([ROLES.ADMIN]), async(req, res) => {
  try{
    const product = await Product.create(req.body)
    res.status(201).send(product)
  }catch(e){
    res.status(400).send({error:e.message})
  }
})

router.patch("/:id", authenticated, hasERole([ROLES.ADMIN]), async (req, res) => {
    const { error, product } = await editProduct(req.params.id, req.body);
    
    if (error) {
        return res.status(400).send({ error });
    }
    
    res.send(product);
});

router.delete("/:id", authenticated, hasERole([ROLES.ADMIN]), async (req, res) => {
    const {error, product} = await deleteProduct(req.params.id)
    if(error){
        return res.status(400).send({error})
    }

    res.send({message: "Товар удален", product})
})



module.exports = router;
