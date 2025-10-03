const BASE = '';

export const api = {
  async getProducts() { return fetchJson('/api/products'); },
  async getProduct(id) { return fetchJson(`/api/products/${encodeURIComponent(id)}`); },
  async signup(data) { return fetchJson('/api/auth/signup', { method: 'POST', body: JSON.stringify(data) }); },
  async login(data) { return fetchJson('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }); },
  async me() { return fetchJson('/api/auth/me'); },
  async logout() { return fetchJson('/api/auth/logout', { method: 'POST' }); },
  async sendOtp(phone) { return fetchJson('/api/auth/otp/send', { method: 'POST', body: JSON.stringify({ phone }) }); },
  async verifyOtp(data) { return fetchJson('/api/auth/otp/verify', { method: 'POST', body: JSON.stringify(data) }); },
  async getCart() { return fetchJson('/api/cart'); },
  async setCart(items) { return fetchJson('/api/cart/set', { method: 'POST', body: JSON.stringify({ items }) }); },
  async mergeCart(guestItems) { return fetchJson('/api/cart/merge', { method: 'POST', body: JSON.stringify({ guestItems }) }); },
  async createOrder(data) { return fetchJson('/api/orders', { method: 'POST', body: JSON.stringify(data) }); },
  async listOrders() { return fetchJson('/api/orders'); },
  async markPaid(orderId) { return fetchJson(`/api/orders/${orderId}/mark-paid`, { method: 'POST' }); },
  async stripeIntent(amount, currency) { return fetchJson('/api/payments/stripe/intent', { method: 'POST', body: JSON.stringify({ amount, currency }) }); },
  async paypalCreate(amount, currency) { return fetchJson('/api/payments/paypal/create-order', { method: 'POST', body: JSON.stringify({ amount, currency }) }); },
  async maghrebPay(provider, payload) { return fetchJson(`/api/payments/local/${provider}`, { method: 'POST', body: JSON.stringify(payload) }); },
  async downloadLink(orderId, productId) { return fetchJson('/api/downloads/link', { method: 'POST', body: JSON.stringify({ orderId, productId }) }); },
  async adminOverview(username, password) { return fetchJson(`/api/admin/overview?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`); }
};

async function fetchJson(pathname, opts = {}) {
  const resp = await fetch(BASE + pathname, { headers: { 'Content-Type': 'application/json' }, credentials: 'include', ...opts });
  if (!resp.ok) throw new Error((await safeJson(resp))?.message || 'Request failed');
  return safeJson(resp);
}

async function safeJson(resp) {
  try { return await resp.json(); } catch { return {}; }
}

