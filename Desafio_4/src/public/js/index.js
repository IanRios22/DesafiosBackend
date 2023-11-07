const socket = io();

socket.on("productos", (data) => {
    const productList = document.querySelector(".contenedor");
    productList.innerHTML = " ";
    data.forEach(element => {
        const Items = `
            <div class="product">
            <h3>${element.title}</h3>
            <p>ID: ${element.id}</p>
            <p>Descripcion: ${element.description}</p>
            <p>Precio: $${element.price}</p>
            <p>Stock: ${element.stock}</p>
            </div>
        `;
        productList.innerHTML += Items;
    });
})