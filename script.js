const products = [
  { id: 1, name: 'Gaseosa Inca Kola 1L', price: 8.5, category: 'gaseosas', img: 'https://picsum.photos/seed/incakola/300/200', desc: 'Refrescante gaseosa amarilla, 1 litro.' },
  { id: 2, name: 'Gaseosa Coca-Cola 1L', price: 8.0, category: 'gaseosas', img: 'https://picsum.photos/seed/cocacola/300/200', desc: 'Bebida gaseosa clásica, 1 litro.' },
  { id: 3, name: 'Galletas Oreo', price: 4.5, category: 'galletas', img: 'https://picsum.photos/seed/oreo/300/200', desc: 'Galletas rellenas de crema, bolsa de 126g.' },
  { id: 4, name: 'Galletas Soda', price: 2.5, category: 'galletas', img: 'https://picsum.photos/seed/soda/300/200', desc: 'Galletas saladas, paquete de 140g.' },
  { id: 5, name: 'Agua Mineral 625ml', price: 2.0, category: 'bebidas', img: 'https://picsum.photos/seed/agua/300/200', desc: 'Agua purificada sin gas.' },
  { id: 6, name: 'Jugo de Naranja 1L', price: 6.5, category: 'bebidas', img: 'https://picsum.photos/seed/jugo/300/200', desc: 'Jugo natural de naranja, 1 litro.' },
  { id: 7, name: 'Leche Entera 1L', price: 5.0, category: 'lacteos', img: 'https://picsum.photos/seed/leche/300/200', desc: 'Leche fresca entera, 1 litro.' },
  { id: 8, name: 'Yogurt Fresa 500ml', price: 6.0, category: 'lacteos', img: 'https://picsum.photos/seed/yogurt/300/200', desc: 'Yogurt batido sabor fresa.' },
  { id: 9, name: 'Pan de Molde', price: 4.0, category: 'panaderia', img: 'https://picsum.photos/seed/pan/300/200', desc: 'Pan de molde blanco, 500g.' },
  { id: 10, name: 'Arroz 1kg', price: 5.5, category: 'granos', img: 'https://picsum.photos/seed/arroz/300/200', desc: 'Arroz extra superior, bolsa de 1kg.' },
  { id: 11, name: 'Fideos Spaghetti 500g', price: 3.0, category: 'granos', img: 'https://picsum.photos/seed/fideos/300/200', desc: 'Pasta seca, paquete de 500g.' },
  { id: 12, name: 'Azúcar Blanca 1kg', price: 4.2, category: 'granos', img: 'https://picsum.photos/seed/azucar/300/200', desc: 'Azúcar blanca refinada, 1kg.' },
  { id: 13, name: 'Chocolate Negro 100g', price: 3.5, category: 'dulces', img: 'https://picsum.photos/seed/chocolate/300/200', desc: 'Chocolate con 60% de cacao.' },
  { id: 14, name: 'Caramelos surtidos', price: 2.0, category: 'dulces', img: 'https://picsum.photos/seed/caramelos/300/200', desc: 'Bolsa de caramelos surtidos, 100g.' },
  { id: 15, name: 'Detergente 500g', price: 6.8, category: 'limpieza', img: 'https://picsum.photos/seed/detergente/300/200', desc: 'Detergente en polvo con aroma a lavanda.' },
  { id: 16, name: 'Papel Higiénico 4u', price: 7.5, category: 'limpieza', img: 'https://picsum.photos/seed/papel/300/200', desc: 'Pack de 4 rollos, hoja doble.' }
];

let cart = [];
let currentFilter = 'todos';

const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const cart = document.getElementById('cart');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCart');
const cartBtn = document.getElementById('cartBtn');
const buyBtn = document.getElementById('buyBtn');
const toast = document.getElementById('toast');
const filterButtons = document.querySelectorAll('.filter-btn');

function formatPrice(value) {
  return 'S/ ' + value.toFixed(2);
}

function renderProducts(filter) {
  const list = filter === 'todos' ? products : products.filter((p) => p.category === filter);
  if (list.length === 0) {
    productGrid.innerHTML = '<p class="no-results">No hay productos en esta categoría.</p>';
    return;
  }
  productGrid.innerHTML = list.map((p) => `
    <div class="card">
      <img src="${p.img}" alt="${p.name}" />
      <span class="badge">${p.category}</span>
      <div class="card-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <span class="price">${formatPrice(p.price)}</span>
        <button class="add-btn" onclick="addToCart(${p.id})">Agregar al carrito</button>
      </div>
    </div>
  `).join('');
}

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderProducts(currentFilter);
  });
});

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((i) => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
  showToast(product.name + ' agregado al carrito');
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== id);
  }
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  renderCart();
}

function renderCart() {
  const totalQty = cart.reduce((acc, i) => acc + i.qty, 0);
  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  cartCount.textContent = totalQty;
  cartTotal.textContent = formatPrice(total);

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
  } else {
    cartItems.innerHTML = cart.map((i) => `
      <div class="cart-item">
        <img src="${i.img}" alt="${i.name}" />
        <div class="cart-item-info">
          <h4>${i.name}</h4>
          <p>${formatPrice(i.price * i.qty)}</p>
          <div class="cart-item-actions">
            <button onclick="changeQty(${i.id}, -1)">-</button>
            <span>${i.qty}</span>
            <button onclick="changeQty(${i.id}, 1)">+</button>
            <button class="remove-btn" onclick="removeFromCart(${i.id})">Eliminar</button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

function openCart() {
  cart.classList.add('open');
  cartOverlay.classList.add('open');
}

function closeCart() {
  cart.classList.remove('open');
  cartOverlay.classList.remove('open');
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

buyBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    showToast('Tu carrito está vacío');
    return;
  }
  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  showToast('¡Compra realizada! Total: ' + formatPrice(total));
  cart = [];
  renderCart();
  setTimeout(closeCart, 400);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCart();
});

renderProducts('todos');
renderCart();