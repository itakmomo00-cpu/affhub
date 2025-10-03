import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { loadDb } from '../services/store.js';

const router = Router();

function isAdminAuth(req) {
  const { username, password } = req.body || req.query || {};
  const envUser = process.env.ADMIN_USERNAME || 'admin';
  const envPass = process.env.ADMIN_PASSWORD || 'admin123';
  return username === envUser && password === envPass;
}

router.post('/login', (req, res) => {
  if (!isAdminAuth(req)) return res.status(401).json({ message: 'Unauthorized' });
  res.json({ ok: true });
});

router.get('/overview', async (req, res) => {
  if (!isAdminAuth(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = await loadDb();
  res.json({ counts: { users: db.users.length, products: db.products.length, orders: db.orders.length } });
});

router.get('/orders', async (req, res) => {
  if (!isAdminAuth(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = await loadDb();
  res.json({ orders: db.orders });
});

router.get('/products', async (req, res) => {
  if (!isAdminAuth(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = await loadDb();
  res.json({ products: db.products });
});

export default router;

