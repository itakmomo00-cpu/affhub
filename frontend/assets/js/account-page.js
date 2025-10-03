import { i18n } from './i18n.js';
import { api } from './api.js';

const app = document.getElementById('app');
i18n.init();
render();

async function render() {
  try {
    const { user } = await api.me();
    const { orders } = await api.listOrders();
    app.innerHTML = `
      <header class="site-header"><a href="/" class="logo">NEON<span>SHOP</span></a></header>
      <main class="container">
        <h1>${i18n.t('account')}</h1>
        <div class="glass">
          <div>Email: ${user.email || '-'}</div>
          <div>Phone: ${user.phone || '-'}</div>
          <button id="logout" class="btn">${i18n.t('logout')}</button>
        </div>
        <h2>${i18n.t('orders')}</h2>
        <div class="glass">${orders.map(o => row(o)).join('') || '<div>None</div>'}</div>
      </main>`;
    document.getElementById('logout').onclick = async () => { await api.logout(); location.href = '/'; };
  } catch {
    location.href = '/login.html?next=/account.html';
  }
}

function row(o) {
  const digital = o.items.filter(i => i.type === 'digital');
  return `<div style="margin:8px 0;">
    <div>Order ${o.id} - ${o.status}</div>
    ${digital.map(d => `<a href="#" data-download="${o.id}:${d.productId}">${d.productId}</a>`).join(' ')}
  </div>`;
}

document.addEventListener('click', async (e) => {
  const a = e.target.closest('[data-download]');
  if (!a) return;
  e.preventDefault();
  const [orderId, productId] = a.getAttribute('data-download').split(':');
  const { url } = await api.downloadLink(orderId, productId);
  location.href = url;
});

