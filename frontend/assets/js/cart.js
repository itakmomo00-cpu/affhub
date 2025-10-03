const KEY = 'guest_cart';

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function write(items) { localStorage.setItem(KEY, JSON.stringify(items)); }

export const cart = {
  getItems() { return read(); },
  add(productId, qty = 1, variantId = null) {
    const items = read();
    const idx = items.findIndex(i => i.productId === productId && i.variantId === variantId);
    if (idx >= 0) items[idx].qty += qty; else items.push({ productId, qty, variantId });
    write(items);
  },
  set(items) { write(items || []); },
  clear() { write([]); }
};

