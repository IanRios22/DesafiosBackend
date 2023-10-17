const fs = require('fs');

class ProductManager {
    constructor(archivo) {
        this.path = archivo;
        if (!fs.existsSync(archivo)) {
            fs.writeFileSync(archivo, '[]', 'utf8');
        }
        this.cargarProducts(); // Cargamos los productos al iniciar la instancia
    }

    cargarProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    guardarProductos() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
    }

    generateId() {
        if (this.products.length === 0) {
            return 1;
        }
        const maxId = Math.max(...this.products.map(product => product.id));
        return maxId + 1;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        // Validar campos incompletos:
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return 'Por favor, complete todos los campos para agregar un producto.';
        }

        const codeExist = this.products.some(product => product.code === code)

        if (codeExist) {
            return new Error(`El codigo ${code} ya existe!!!`)
        }

        // Si es correcto, asignar un ID único:
        const id = this.generateId();

        // Si es correcto, escribir el archivo:
        try {
            const product = { id, title, description, price, thumbnail, code, stock }
            this.products.push(product);
            this.guardarProductos();
            return product; // Devolvemos el producto agregado
        } catch (err) {
            return `Error al agregar un producto: ${err}`;
        }
    }

    getProducts() {
        return this.products; // No hace falta cargar los productos nuevamente, ya se cargaron en el constructor
    }

    getProductId(id) {
        const product = this.products.find((product) => product.id == id);
        if (!product) {
            throw new Error('No existe el producto con ese ID :c');
        }
        return product;
    }

    updateProduct(id, field, value) {
        const products = this.getProducts();
        const product = products.find(product => product.id === id);

        // Validar ID:
        if (!product) {
            return `No existe un producto con el ID ${id}`;
        }

        // Validar campo:
        if (!(field in product)) {
            return `No existe el campo "${field}" en el producto ${id}`;
        }

        // Validar valor:
        if (value === undefined) {
            return `El valor es incorrecto`;
        }

        // Si es correcto, actualizamos el campo específico y escribimos el archivo:
        product[field] = value;
        try {
            fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
        } catch (err) {
            return `Error al escribir el archivo al actualizar el producto: ${err}`;
        }

        return product;
    }


    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) {
            throw new Error('No existe el producto con ese ID :c');
        }

        this.products.splice(index, 1);
        this.guardarProductos();
    }
}

const productManager = new ProductManager('productos.json');
console.log('Productos iniciales: ', productManager.getProducts());

productManager.addProduct('prod1', 'Description 1', 200, 'no image', 'abc1', 10);
productManager.addProduct('prod2', 'Description 2', 300, 'no image2', 'abc12', 15);
productManager.addProduct("prod3", "Description 3", 400, "no image3", "code 3", 40);
productManager.addProduct("prod4", "Description 4", 500, "no image4", "code 4", 50);
productManager.addProduct("prod5", "Description 5", 600, "no image5", "code 5", 60);
productManager.addProduct("prod6", "Description 6", 700, "no image6", "code 6", 70);
productManager.addProduct("prod7", "Description 7", 800, "no image7", "code 7", 80);

//Aqui veremos el array de los productos
console.log('Productos ingresados: ', productManager.getProducts());

// Aquí tratamos de agregar un producto más con el mismo código
const prodnew = productManager.addProduct(
    'prod8',
    'Description 8',
    800,
    'no image8',
    'abc1', // Mismo código que prod1 xd
    8
);

if (prodnew instanceof Error) {
    console.error(prodnew.message);
} else {
    console.log('Producto agregado correctamente:', prodnew);
}

//Obtener un producto con su ID
console.log('Llamado para mostrar el producto según su ID: ', productManager.getProductId(6));

// En esta sección probaremos la actualización ante cambios en un producto
productManager.updateProduct(2, 'stock', 20);
productManager.updateProduct(1, 'code', 'code 1');
console.log('Productos actualizados: ', productManager.getProducts());

//En esta seccion eliminaremos productos segun el ID
productManager.deleteProduct(5);

console.log('Productos actualizados: ', productManager.getProducts());