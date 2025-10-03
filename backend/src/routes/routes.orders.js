import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { loadDb, saveDb } from '../services/store.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

function getUser(req) {
  try {
    const token = req.cookies.session || (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    return payload;
  } catch {
    return null;
  }
}

router.get('/', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ message: 'Login required' });
  const db = await loadDb();
  const orders = db.orders.filter(o => o.userId === user.id);
  res.json({ orders });
});

router.post('/', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ message: 'Login required' });
  const { items, paymentMethod, shippingAddress } = req.body;
  const db = await loadDb();
  const id = uuidv4();
  const now = new Date().toISOString();
  const order = {
    id,
    userId: user.id,
    items: items || [],
    paymentMethod,
    shippingAddress: shippingAddress || null,
    status: paymentMethod === 'cod' ? 'pending_cod' : 'pending',
    createdAt: now,
    updatedAt: now,
    paidAt: null
  };
  db.orders.push(order);
  await saveDb(db);
  res.json({ order });
});

router.post('/:id/mark-paid', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ message: 'Login required' });
  const db = await loadDb();
  const order = db.orders.find(o => o.id === req.params.id && o.userId === user.id);
  if (!order) return res.status(404).json({ message: 'Not found' });
  order.status = 'paid';
  order.paidAt = new Date().toISOString();
  order.updatedAt = order.paidAt;
  await saveDb(db);
  res.json({ order });
});

export default router;

