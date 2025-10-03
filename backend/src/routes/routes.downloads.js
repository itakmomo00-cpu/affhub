import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { createSignedDownloadUrl, validateSignedUrl, verifyOwnership, getDigitalFilePath } from '../services/downloads.js';

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

router.post('/link', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ message: 'Login required' });
  const { orderId, productId } = req.body;
  const owns = await verifyOwnership(user.id, orderId, productId);
  if (!owns) return res.status(403).json({ message: 'Not authorized' });
  const url = await createSignedDownloadUrl({ productId, minutesValid: 10 });
  res.json({ url, expiresInMinutes: 10 });
});

export default router;

// Actual file download served here via signed URL
router.get('/file', async (req, res) => {
  const { p, e, s } = req.query;
  if (!p || !e || !s) return res.status(400).send('Invalid link');
  const ok = validateSignedUrl(p, e, s);
  if (!ok) return res.status(400).send('Link expired or invalid');
  const filePath = await getDigitalFilePath(p);
  if (!filePath) return res.status(404).send('File not found');
  res.download(filePath);
});

