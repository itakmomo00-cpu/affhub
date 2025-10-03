import { Router } from 'express';
import { loadDb } from '../services/store.js';

const router = Router();

router.get('/', async (req, res) => {
  const db = await loadDb();
  res.json({ products: db.products });
});

router.get('/:id', async (req, res) => {
  const db = await loadDb();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json({ product });
});

export default router;

