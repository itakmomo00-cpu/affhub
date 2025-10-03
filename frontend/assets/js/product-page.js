import { i18n } from './i18n.js';
import { api } from './api.js';
import { cart } from './cart.js';

const app = document.getElementById('app');
i18n.init();

const params = new URLSearchParams(location.search);
const id = params.get('id');
render();

async function render() {
  const { product } = await api.getProduct(id);
  app.innerHTML = `
    <header class="site-header">
      <a href="/products.html" class="logo">← NEON<span>SHOP</span></a>
      <div class="header-actions"><button id="lang">${i18n.lang().toUpperCase()}</button></div>
    </header>
    <main class="container">
      <div class="glass" style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
        <img src="${product.images?.[0] || '/assets/images/placeholder.jpg'}" alt="${i18n.tName(product.name)}" style="width:100%; border-radius: 12px;" />
        <div>
          <h1>${i18n.tName(product.name)}</h1>
          <div>$${(product.price/100).toFixed(2)}</div>
          <p>${i18n.lang() === 'fr' ? product.description.fr : product.description.en}</p>
          <button id="add" class="btn btn-neon">${i18n.t('add_to_cart')}</button>
        </div>
      </div>
    </main>`;
  document.getElementById('lang').onclick = () => { i18n.toggle(); render(); };
  document.getElementById('add').onclick = () => { cart.add(product.id, 1, null); };
}

