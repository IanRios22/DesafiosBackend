import { Router } from "express";
import { ProductManager } from "../managers/product.manager.js";

const router = new Router();
const store = new ProductManager();

router.get('/', async (req, res) => {
    const products = await store.getProducts();
    res.render('realtimeproducts', { style: "products.css" });
})

export default router;