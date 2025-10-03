import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { loadDb, saveDb } from '../services/store.js';

const router = Router();

function getUserIdFromReq(req) {
  try {
    const token = req.cookies.session || (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    return payload.id;
  } catch {
    return null;
  }
}

router.get('/', async (req, res) => {
  const userId = getUserIdFromReq(req);
  const db = await loadDb();
  const cart = db.carts[userId] || { items: [] };
  res.json({ cart });
});

router.post('/set', async (req, res) => {
  const userId = getUserIdFromReq(req);
  if (!userId) return res.status(401).json({ message: 'Login required' });
  const { items } = req.body;
  const db = await loadDb();
  db.carts[userId] = { items: items || [] };
  await saveDb(db);
  res.json({ cart: db.carts[userId] });
});

router.post('/merge', async (req, res) => {
  const userId = getUserIdFromReq(req);
  if (!userId) return res.status(401).json({ message: 'Login required' });
  const { guestItems } = req.body;
  const db = await loadDb();
  const existing = db.carts[userId]?.items || [];
  const merged = [...existing];
  for (const gi of guestItems || []) {
    const idx = merged.findIndex(i => i.productId === gi.productId && i.variantId === gi.variantId);
    if (idx >= 0) merged[idx].qty += gi.qty;
    else merged.push(gi);
  }
  db.carts[userId] = { items: merged };
  await saveDb(db);
  res.json({ cart: db.carts[userId] });
});

export default router;

