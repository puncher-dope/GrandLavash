"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router({ mergeParams: true });
const products_1 = require("../controllers/products");
const Product_1 = require("../models/Product");
const authenticated_1 = __importDefault(require("../middlewares/authenticated"));
const hasERole_1 = __importDefault(require("../helpers/hasERole"));
const roles_1 = require("../constants/roles");
router.get("/", async (req, res) => {
    const { error, products } = await (0, products_1.getAllProducts)();
    error
        ? res.status(400).send({ error, products })
        : res.status(200).send({ error, products });
});
router.get("/:id", async (req, res) => {
    const { error, product } = await (0, products_1.getProductById)(req.params.id);
    error
        ? res.status(400).send({ error, product })
        : res.status(200).send({ error, product });
});
router.post('/', authenticated_1.default, (0, hasERole_1.default)([roles_1.roles.ADMIN]), async (req, res) => {
    try {
        const product = await Product_1.Product.create(req.body);
        res.status(201).send(product);
    }
    catch (e) {
        res.status(400).send({ error: e.message });
    }
});
router.patch("/:id", authenticated_1.default, (0, hasERole_1.default)([roles_1.roles.ADMIN]), async (req, res) => {
    const { error, product } = await (0, products_1.editProduct)(req.params.id, req.body);
    if (error) {
        return res.status(400).send({ error });
    }
    res.send(product);
});
router.delete("/:id", authenticated_1.default, (0, hasERole_1.default)([roles_1.roles.ADMIN]), async (req, res) => {
    const { error, product } = await (0, products_1.deleteProduct)(req.params.id);
    if (error) {
        return res.status(400).send({ error });
    }
    res.send({ message: "Товар удален", product });
});
exports.default = router;
