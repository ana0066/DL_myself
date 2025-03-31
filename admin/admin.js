// admin/admin.js

// Variable global para almacenar los productos obtenidos de la base de datos
let productos = [];

// Función para mostrar mensajes en el elemento "mensaje"
function showMessage(className, messageText) {
  const mensaje = document.getElementById('mensaje');
  mensaje.className = className; // Se asigna la clase para aplicar estilos
  mensaje.textContent = messageText;
  console.log(`Mensaje mostrado: ${messageText} (${className})`);
  setTimeout(() => {
    mensaje.className = '';
    mensaje.textContent = '';
  }, 2500);
}

// Función para cargar los productos desde la base de datos
function cargarProductos() {
  console.log('Cargando productos desde la base de datos...');
  fetch('../server/fetchProducts.php')
    .then(response => response.json())
    .then(data => {
      console.log('Productos cargados:', data);
      productos = data;
      // Actualizar los selects de editar y eliminar
      const productoEd = document.getElementById('productoEditar');
      const productoEl = document.getElementById('productoEliminar');
      productoEd.innerHTML = '<option value="">---</option>';
      productoEl.innerHTML = '<option value="">---</option>';
      data.forEach(producto => {
        console.log('Agregando producto al select:', producto.nombre);
        const option1 = document.createElement('option');
        option1.value = producto.nombre;
        option1.textContent = producto.nombre;
        productoEd.appendChild(option1);
  
        const option2 = document.createElement('option');
        option2.value = producto.nombre;
        option2.textContent = producto.nombre;
        productoEl.appendChild(option2);
      });
  
      // Poblar el select de atributos para editar (excluyendo la columna id)
      const atributoEd = document.getElementById('atributoEditar');
      atributoEd.innerHTML = '<option value="">---</option>';
      if (data.length > 0) {
        Object.keys(data[0]).forEach(key => {
          if (key !== 'id') {
            console.log('Agregando atributo para editar:', key);
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            atributoEd.appendChild(option);
          }
        });
      }
      // Mostrar productos en la sección correspondiente
      mostrarProductos(data);
    })
    .catch(error => {
      console.error('Error al cargar productos:', error);
    });
}

// Función para mostrar los productos en el HTML
function mostrarProductos(data) {
  console.log('Mostrando productos en la interfaz...');
  const mostraProductos = document.getElementById('mostrarProductos');
  mostraProductos.innerHTML = '';
  data.forEach(producto => {
    const card = document.createElement('div');
    card.classList.add('contenedorProductos');
    card.innerHTML = `
      <img src="${producto.urlImagen}" alt="${producto.nombre}">
      <div class="informacion">
        <p>${producto.nombre}</p>
        <p class="precio"><span>Precio: RD$${producto.valor}</span></p>
        <p>Existencia: ${producto.existencia}</p>
      </div>
    `;
    mostraProductos.appendChild(card);
  });
}

// Evento para agregar un producto
document.getElementById("botonAñadir").addEventListener("click", function (event) {
  event.preventDefault();
  console.log('Botón Añadir clickeado');
  
  const nombre = document.getElementById('productoAñadir').value;
  const valor = document.getElementById('valorAñadir').value;
  const existencia = document.getElementById('existenciaAñadir').value;
  const urlImagen = document.getElementById('ImagenAñadir').value;
  
  console.log('Datos ingresados para añadir:', { nombre, valor, existencia, urlImagen });
  
  // Validar que todos los campos estén llenos
  if (!nombre || !valor || !existencia || !urlImagen) {
    showMessage('llenarCampos', 'Por favor, complete todos los campos');
    return;
  }
  
  // Verificar que el producto no exista ya en la base de datos
  if (productos.some(prod => prod.nombre === nombre)) {
    showMessage('repetidoError', 'Este elemento ya existe');
    return;
  }
  
  const producto = { nombre, valor, existencia, urlImagen };
  
  console.log('Enviando petición para agregar producto...', producto);
  // Petición POST para agregar el producto
  fetch('../server/addProduct.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Respuesta de agregar producto:', data);
    if (data.success) {
      showMessage('realizado', 'Producto agregado correctamente');
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showMessage('error', 'Error al agregar el producto');
    }
  })
  
  .catch(error => {
    console.error('Error en la petición de agregar producto:', error);
  });
});

// Evento para editar un producto
document.getElementById("botonEditar").addEventListener("click", function (event) {
  event.preventDefault();
  console.log('Botón Editar clickeado');
  
  const nombre = document.getElementById('productoEditar').value;
  const atributo = document.getElementById('atributoEditar').value;
  const nuevoValor = document.getElementById('nuevoAtributo').value;
  
  console.log('Datos ingresados para editar:', { nombre, atributo, nuevoValor });
  
  if (!nombre || !atributo || !nuevoValor) {
    showMessage('llenarCampos', 'Por favor, complete todos los campos');
    return;
  }
  
  const dataToSend = { nombre, atributo, nuevoValor };
  
  console.log('Enviando petición para editar producto...', dataToSend);
  fetch('../server/editProduct.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToSend)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Respuesta de editar producto:', data);
    if (data.success) {
      showMessage('realizado', 'Producto editado correctamente');
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showMessage('noExisteError', data.message || 'Error al editar producto');
    }
  })
  .catch(error => {
    console.error('Error en la petición de editar producto:', error);
  });
});

// Evento para eliminar un producto
document.getElementById("botonEliminar").addEventListener("click", function (event) {
  event.preventDefault();
  console.log('Botón Eliminar clickeado');
  
  const nombre = document.getElementById('productoEliminar').value;
  console.log('Producto seleccionado para eliminar:', nombre);
  
  if (!nombre) {
    showMessage('llenarCampos', 'Seleccione un producto para eliminar');
    return;
  }
  
  console.log('Enviando petición para eliminar producto...');
  fetch('../server/deleteProduct.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Respuesta de eliminar producto:', data);
    if (data.success) {
      showMessage('realizado', 'Producto eliminado correctamente');
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showMessage('noExisteError', 'Error al eliminar producto');
    }
  })
  .catch(error => {
    console.error('Error en la petición de eliminar producto:', error);
  });
});

// Cargar productos cuando se carga la página
window.addEventListener("load", () => {
  console.log('Página cargada, iniciando carga de productos...');
  cargarProductos();
});
