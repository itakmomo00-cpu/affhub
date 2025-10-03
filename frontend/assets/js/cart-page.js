import { i18n } from './i18n.js';
import { cart } from './cart.js';

const app = document.getElementById('app');
i18n.init();
render();

function render() {
  const items = cart.getItems();
  const total = items.reduce((sum, i) => sum + i.qty * 1000, 0); // mock pricing unless joined with product lookup
  app.innerHTML = `
    <header class="site-header">
      <a href="/" class="logo">NEON<span>SHOP</span></a>
    </header>
    <main class="container">
      <h1>${i18n.t('cart')}</h1>
      <div class="glass">
        ${items.map(i => `<div>Item: ${i.productId} x ${i.qty}</div>`).join('') || '<div>Empty</div>'}
        <div style="margin-top: 10px;">${i18n.t('total')}: $${(total/100).toFixed(2)}</div>
        <a class="btn btn-neon" href="/checkout.html">${i18n.t('checkout')}</a>
      </div>
    </main>`;
}

