class ProductManager {
    constructor() {
        this.products = [];
        this.ID = 0;
    }

    getProducts() {
        return this.products;
    }

    getProductId(id) {
        const product = this.products.find((product) => product.id == id);
        if (!product) {
            throw new Error('No existe el producto con ese ID :c');
        }
        return product;
    }

    generateId() {
        return this.ID++;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (this.products.some((product) => product.code === code)) {
            return console.log('El código ya existe');
        }

        const id = this.generateId();
        const newProduct = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        this.products.push(newProduct);
        return newProduct;
    }
}

const productManager = new ProductManager();
console.log('Productos iniciales: ', productManager.getProducts());

const prod1 = productManager.addProduct(
    'prod1',
    'prodPrueba1',
    200,
    'no image',
    'abc1',
    10
);
const prod2 = productManager.addProduct(
    'prod2',
    'prodPrueba2',
    300,
    'no image2',
    'abc12',
    15
);

//Aqui tratamos de agregar un producto mas con el mismo codigo
const prodnew = productManager.addProduct(
    'prod3',
    'prodPrueba3',
    250,
    'no image3',
    'abc1', // Mismo código que prod1 xd - puedes cambiar el cod para verificar el error
    8
);

if (prodnew === undefined) {
    console.error('Error al agregar un producto repetido, el código ya existe');
}
console.log('Producto agregado: ', prod1);
console.log('Product 2 agregado: ', prod2);
console.log('Product 3 agregado: ', prodnew);

console.log('Productos actualizados: ', productManager.getProducts());

// Obtener un producto con su Id
const prodId = prod1.id;
const prodId2 = prod2.id;
const prodEncontrado = productManager.getProductId(prodId);
const prodEncontrado2 = productManager.getProductId(prodId2);
console.log('Product encontrado por ID: ', prodEncontrado);
console.log('Product encontrado por ID: ', prodEncontrado2);






