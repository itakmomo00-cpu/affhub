import { i18n } from './i18n.js';
import { api } from './api.js';
import { cart } from './cart.js';

const app = document.getElementById('app');
i18n.init();
render();

async function render() {
  try {
    const me = await api.me();
    // Merge guest cart
    const guestItems = cart.getItems();
    if (guestItems.length) {
      await api.mergeCart(guestItems);
      cart.clear();
    }
  } catch {
    location.href = '/login.html?next=/checkout.html';
    return;
  }

  app.innerHTML = `
    <header class="site-header"><a href="/" class="logo">NEON<span>SHOP</span></a></header>
    <main class="container">
      <h1>${i18n.t('checkout')}</h1>
      <div class="glass">
        <div class="tabs">
          <div class="tab active" data-tab="stripe">${i18n.t('stripe')}</div>
          <div class="tab" data-tab="paypal">${i18n.t('paypal')}</div>
          <div class="tab" data-tab="wafacash">${i18n.t('wafacash')}</div>
          <div class="tab" data-tab="barid">${i18n.t('barid')}</div>
          <div class="tab" data-tab="cod">${i18n.t('cod')}</div>
        </div>
        <div id="status" class="success" aria-live="polite"></div>
        <button id="place" class="btn btn-neon">${i18n.t('place_order')}</button>
      </div>
    </main>`;

  const tabs = document.querySelectorAll('.tab');
  let method = 'stripe';
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(tt => tt.classList.remove('active'));
    t.classList.add('active');
    method = t.getAttribute('data-tab');
  }));

  document.getElementById('place').onclick = async () => {
    const status = document.getElementById('status');
    status.textContent = '...';
    let orderResp;
    try {
      orderResp = await api.createOrder({ items: [], paymentMethod: method });
    } catch (e) {
      status.textContent = e.message; status.className='error'; return;
    }
    const orderId = orderResp.order.id;
    try {
      if (method === 'stripe') {
        const { clientSecret } = await api.stripeIntent(1000, 'usd');
        await api.markPaid(orderId);
        status.textContent = `${i18n.t('success')} (Stripe: ${clientSecret})`; status.className='success';
      } else if (method === 'paypal') {
        const { id } = await api.paypalCreate(1000, 'USD');
        await api.markPaid(orderId);
        status.textContent = `${i18n.t('success')} (PayPal: ${id})`; status.className='success';
      } else if (method === 'wafacash' || method === 'barid') {
        await api.maghrebPay(method, { simulate: 'success' });
        await api.markPaid(orderId);
        status.textContent = `${i18n.t('success')} (${method})`; status.className='success';
      } else {
        status.textContent = `${i18n.t('success')} (COD)`; status.className='success';
      }
    } catch (e) {
      status.textContent = e.message; status.className='error';
    }
  };
}

