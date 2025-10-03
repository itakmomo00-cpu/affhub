import { i18n } from './i18n.js';
import { api } from './api.js';
import { cart } from './cart.js';

const app = document.getElementById('app');
i18n.init();

render();

async function render() {
  const { products } = await api.getProducts();
  app.innerHTML = `
    <header class="site-header">
      <div class="logo">NEON<span>SHOP</span></div>
      <div class="header-actions">
        <button id="lang">${i18n.lang().toUpperCase()}</button>
        <a href="/cart.html" class="icon">🛒</a>
      </div>
    </header>
    <main class="container">
      <h1>${i18n.t('products')}</h1>
      <div class="product-grid">${products.map(p => card(p)).join('')}</div>
    </main>`;
  document.getElementById('lang').onclick = () => { i18n.toggle(); render(); };
  document.querySelectorAll('[data-add]')?.forEach(btn => btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-add');
    cart.add(id, 1, null);
    btn.textContent = '✓';
    setTimeout(()=> btn.textContent = i18n.t('add_to_cart'), 800);
  }));
}

function card(p) {
  const typeClass = p.type;
  return `
    <div class="product-card">
      <img loading="lazy" src="${p.images?.[0] || '/assets/images/placeholder.jpg'}" alt="${i18n.tName(p.name)}" />
      <div class="meta">
        <div><span class="badge-type ${typeClass}">${(i18n.t('type_' + typeClass))}</span></div>
        <div>${i18n.tName(p.name)}</div>
        <div>$${(p.price/100).toFixed(2)}</div>
        <div style="display:flex; gap:8px;">
          <a class="btn btn-neon" href="/product.html?id=${p.id}">${i18n.t('view')}</a>
          <button class="btn" data-add="${p.id}">${i18n.t('add_to_cart')}</button>
        </div>
      </div>
    </div>`;
}

