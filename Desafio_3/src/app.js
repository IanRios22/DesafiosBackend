import express from "express";
import { ProductManager } from "./manager/ProductManager.js";

const productManager = new ProductManager('./productos.json');

const app = express();
app.use(express.json());

// Ruta para obtener todos los productos
app.get('/products', async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await productManager.getProducts();
        if (limit) {
            const limitedProducts = products.slice(0, parseInt(limit, 10));
            res.json(limitedProducts);
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos.' });
    }
});

// Ruta para obtener un producto por ID
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productManager.getProductsById(parseInt(id, 10));
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto.' });
    }
});

const port = 8080;

app.listen(port, () => {
    console.log(`Servidor Express funcionando en el puerto: ${port}`);
});