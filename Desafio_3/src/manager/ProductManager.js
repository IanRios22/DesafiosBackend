import fs from 'fs';

export class ProductManager {
    constructor(filepath) {
        this.filepath = './productos.json';
        // Verificar si el archivo existe, y si no, crearlo con un array vacío
        if (!fs.existsSync(this.filepath)) {
            fs.writeFileSync(this.filepath, '[]', 'utf-8');
        }
    }

    async getProducts() {
        try {
            const productsJSON = await fs.promises.readFile(this.filepath, 'utf-8');
            return JSON.parse(productsJSON);
        } catch (error) {
            console.log(error);
        }
    }

    async getProductByLimit(limit) {
        try {
            const products = await this.getProducts();
            if (!limit || limit >= products.length) return products
            else return products.slice(0, limit);
        } catch (error) {
            console.log(error);
        }
    }
    async #getMaxId() {
        let maxId = 0;
        const products = await this.getProducts();
        products.map((product) => {
            if (product.id > maxId) maxId = product.id;
        });
        return maxId;
    }
    async addProduct(obj) {
        try {
            const product = {
                id: (await this.#getMaxId()) + 1,
                ...obj,
            };
            const products = await this.getProducts();
            products.push(product);
            await fs.promises.writeFile(this.filepath, JSON.stringify(products, null, 2)); // Agregar null y 2 para dar formato JSON
        } catch (error) {
            console.log(error);
        }
    }

    async getProductsById(id) {
        try {
            const products = await this.getProducts();
            const product = products.find(p => p.id === id);
            if (product) {
                return product;
            } else {
                console.log(`Producto con ID ${id} no encontrado. `);
                return null;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async updateProducts(obj, id) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(product => product.id === id);
            if (index !== -1) {
                const prodUpdate = { ...obj, id };
                products[index] = prodUpdate;
                await fs.promises.writeFile(this.filepath, JSON.stringify(products));
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProducts(id) {
        try {
            const products = await this.getProducts();
            const newProd = products.filter(product => product.id !== id);
            await fs.promises.writeFile(this.filepath, JSON.stringify(newProd, null, 2)); // Agregar null y 2 para dar formato JSON
        } catch (error) {
            console.log(error);
        }
    }


}

const productManager = new ProductManager();

const producto1 = {
    title: 'pepinillo',
    description: 'Verdura',
    price: '5',
    thumbnail: 'Noimage',
    //code: '123',
    stock: 100
};

const producto2 = {
    title: 'Platano',
    description: 'Amarilla',
    price: '10',
    thumbnail: 'NoImage',
    //code: '1234',
    stock: 200
};

const producto3 = {
    title: 'pera',
    description: 'fruta',
    price: '15',
    thumbnail: 'NoImage',
    //code: '123456',
    stock: 300
};

const producto4 = {
    title: 'Sandia',
    description: 'fruta',
    price: '20',
    thumbnail: 'NoImage',
    //code: '123sdgs',
    stock: 50
};
const producto5 = {
    title: 'Tomate',
    description: 'verdura',
    price: '25',
    thumbnail: 'NoImage',
    //code: '123fasdfht',
    stock: 400
};
const producto6 = {
    title: 'Uvas',
    description: 'fruta',
    price: '18',
    thumbnail: 'NoImage',
    //code: '12"#$gw3',
    stock: 50
};


const prueba = async () => {
    const productosAAgregar = [producto1, producto2, producto3, producto4, producto5, producto6];
    const existingProducts = await productManager.getProducts();

    for (const producto of productosAAgregar) {
        const isDuplicate = existingProducts.some((p) => p.id === producto.id);
        if (isDuplicate) {
            console.log(`El producto con ID ${producto.id} ya existe.`);
        } else {
            await productManager.addProduct(producto);
            console.log(`Producto "${producto.title}" agregado.`);
        }
    }

    console.log('Lista de productos', await productManager.getProducts());
}

// Llamamos a la función de prueba una vez para agregar los productos y mostrar la lista.
prueba();