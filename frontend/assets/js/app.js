import { i18n } from './i18n.js';
import { api } from './api.js';
import { cart } from './cart.js';

const langBtn = document.getElementById('lang-toggle');
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

// i18n init
i18n.init();
if (langBtn) {
  langBtn.textContent = i18n.lang().toUpperCase();
  langBtn.addEventListener('click', () => {
    i18n.toggle();
    langBtn.textContent = i18n.lang().toUpperCase();
  });
}

// Load featured products on home
const featuredEl = document.getElementById('featured');
if (featuredEl) {
  api.getProducts().then(({ products }) => {
    featuredEl.innerHTML = products.slice(0, 6).map(p => cardHtml(p)).join('');
  });
}

// Cart count
const countEl = document.getElementById('cart-count');
if (countEl) countEl.textContent = String(cart.getItems().reduce((a, b) => a + b.qty, 0));

function cardHtml(p) {
  const type = p.type;
  return `
    <div class="product-card">
      <img loading="lazy" src="${p.images?.[0] || '/assets/images/placeholder.jpg'}" alt="${i18n.tName(p.name)}" />
      <div class="meta">
        <div><span class="badge-type ${type}">${type.toUpperCase()}</span></div>
        <div>${i18n.tName(p.name)}</div>
        <div>$${(p.price/100).toFixed(2)}</div>
        <a class="btn btn-neon" href="/product.html?id=${p.id}" data-i18n="view">View</a>
      </div>
    </div>`;
}

