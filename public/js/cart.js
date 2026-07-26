const CART_KEY = "sa_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(item, qty) {
  const cart = getCart();
  const existing = cart.find((l) => l.id === item.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, priceLabel: item.priceLabel, qty });
  }
  saveCart(cart);
  return cart;
}

function setQty(id, qty) {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter((l) => l.id !== id);
  } else {
    const line = cart.find((l) => l.id === id);
    if (line) line.qty = qty;
  }
  saveCart(cart);
  return cart;
}

function removeFromCart(id) {
  const cart = getCart().filter((l) => l.id !== id);
  saveCart(cart);
  return cart;
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
}

function cartCount() {
  return getCart().reduce((sum, l) => sum + l.qty, 0);
}

function cartTotal() {
  return getCart().reduce((sum, l) => sum + (Number(l.price) || 0) * l.qty, 0);
}

function formatEuro(n) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function updateCartBar() {
  const bar = document.getElementById("cart-bar");
  if (!bar) return;
  const count = cartCount();
  if (count > 0) {
    bar.classList.add("visible");
    const countEl = document.getElementById("cart-bar-count");
    if (countEl) countEl.textContent = count;
    const totalEl = document.getElementById("cart-bar-total");
    if (totalEl) totalEl.textContent = formatEuro(cartTotal());
  } else {
    bar.classList.remove("visible");
  }
}
