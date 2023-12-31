import express from "express";
import productsRouter from "./routes/product.router.js"
import handlebars from "express-handlebars";
import cartsRouter from "./routes/cart.router.js";
import __dirname from "./utils.js";
import realtimeproducts from "./routes/real.time.products.js"
import { Server } from "socket.io";
import { ProductManager } from "./managers/product.manager.js";

const store = new ProductManager();
const PORT = 8080;
const app = express();
const httpServer = app.listen(PORT, () => {
    console.log("Server corriendo en puerto ", PORT);
});

const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/realtimeproducts", realtimeproducts);

socketServer.on("connection", async (socket) => {
    console.log("Nuevo Cliente conectado en el servidor");
    const productos = await store.getProducts();
    socket.emit("productos", productos)
})

export default socketServer;