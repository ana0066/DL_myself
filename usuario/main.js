// Variables globales
let productos = [];

// Referencias al DOM
const contenedor = document.getElementById('contenedor');

// Función para obtener productos desde la base de datos
function fetchProductos() {
    fetch('../server/fetchProducts.php')
        .then(response => response.json())
        .then(data => {
            productos = data;
            visualizarProductos();
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

// Función para mostrar los productos en la página
function visualizarProductos() {
    contenedor.innerHTML = '';
    productos.forEach(producto => {
        const productoHTML = `<div class="producto">
            <img src="${producto.urlImagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p class="precio">$${producto.valor}</p>
            <p class="stock">Stock: ${producto.existencia}</p>
            ${producto.existencia > 0 ? `<button onclick="comprar('${producto.nombre}')">Comprar</button>` : '<p class="soldOut">Agotado</p>'}
        </div>`;
        contenedor.innerHTML += productoHTML;
    });
}

// Función para comprar un producto
function comprar(nombreProducto) {
    fetch('../server/buyProduct.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: nombreProducto })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Compra exitosa');
            fetchProductos();
        } else {
            alert('Error al realizar la compra');
        }
    })
    .catch(error => console.error('Error en la compra:', error));
}

// Cargar productos al cargar la página
window.onload = fetchProductos;
