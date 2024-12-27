document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split("/").pop();
    let category = '';

    switch (currentPage) {
        case 'mate.html':
            category = 'mate';
            break;
        case 'navidad.html':
            category = 'navidad';
            break;
        case 'maquillajes.html':
            category = 'maquillajes';
            break;
        case 'jugueteria.html':
            category = 'jugueteria';
            break;
        case 'agendas_2025.html':
            category = 'agendas';
            break;
        default:
            displayCart();
            return;
    }

    cargarProductos(category);

    document.querySelectorAll('.tarjeta').forEach(tarjeta => {
        tarjeta.addEventListener('click', () => {
            alert(tarjeta.getAttribute('data-description'));
        });
    });
});

function cargarProductos(category) {
    const productosContainer = document.getElementById('productos-container');
    const productosCategoria = productos[category] || [];

    productosCategoria.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.className = 'grid-item';
        productoCard.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <p>${producto.descripcion} | Stock disponible | Precio: ${producto.precio} pesos</p>
            <button class="add-to-cart btn btn-success" data-product="${producto.nombre}" data-price="${producto.precio}">Agregar al carrito</button>
        `;
        productosContainer.appendChild(productoCard);
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            const price = parseInt(button.getAttribute('data-price'), 10);
            addToCart(product, price);
        });
    });
}

function addToCart(product, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.product === product);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ product, price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function removeFromCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(i => i.product === product);
    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
        } else {
            cart.splice(itemIndex, 1);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function deleteFromCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.product !== product);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    if (!cartItems || !cartCount || !cartTotal) {
        console.error("Elementos del DOM no encontrados");
        return;
    }

    cartItems.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `${item.product} - ${item.price} x ${item.quantity} unidades 
            <button class="increase-quantity btn btn-sm btn-secondary" data-product="${item.product}">+</button>
            <button class="decrease-quantity btn btn-sm btn-secondary" data-product="${item.product}">-</button>
            <button class="delete-item btn btn-sm btn-danger" data-product="${item.product}">Eliminar</button>`;
        cartItems.appendChild(li);
    });

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    cartTotal.textContent = total;
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);

    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            addToCart(product, parseInt(button.getAttribute('data-price'), 10));
        });
    });

    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            removeFromCart(product);
        });
    });

    document.querySelectorAll('.delete-item').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            deleteFromCart(product);
        });
    });
}

function showCheckoutModal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');

    if (!checkoutItems || !checkoutTotal) {
        console.error("Elementos del DOM no encontrados");
        return;
    }

    checkoutItems.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `${item.product} - ${item.price} x ${item.quantity} unidades`;
        checkoutItems.appendChild(li);
    });

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    checkoutTotal.textContent = total;

    $('#checkoutModal').modal('show');
}

function finalizePurchase() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productsField = document.getElementById('productsField');
    const totalField = document.getElementById('totalField');

    if (!productsField || !totalField) {
        console.error("Elementos del DOM no encontrados");
        return;
    }

    let productDetails = cart.map(item => `${item.product} - ${item.price} x ${item.quantity}`).join(', ');
    let totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    productsField.value = productDetails;
    totalField.value = totalAmount;

    document.getElementById('checkoutForm').submit();

    alert('Compra finalizada con éxito!');
    localStorage.removeItem('cart');
    $('#checkoutModal').modal('hide');
    displayCart();
}

function cancelPurchase() {
    alert('Compra cancelada!');
    localStorage.removeItem('cart');
    displayCart();
}

function generarListadoProductos(data) {
    console.log("Lista de productos disponibles:");
    data.forEach(producto => {
        console.log(`Producto: ${producto.nombre}, Precio: ${producto.precio} pesos, Descripción: ${producto.descripcion}`);
    });
}
