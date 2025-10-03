import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { loadDb } from './store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const secret = process.env.JWT_SECRET || 'dev_secret';
const downloadBase = '/api/downloads/file';

export async function verifyOwnership(userId, orderId, productId) {
  const db = await loadDb();
  const order = db.orders.find(o => o.id === orderId && o.userId === userId && (o.status === 'paid' || o.status === 'fulfilled'));
  if (!order) return false;
  return order.items.some(i => i.productId === productId);
}

export async function createSignedDownloadUrl({ productId, minutesValid = 10 }) {
  const expires = Date.now() + minutesValid * 60 * 1000;
  const payload = `${productId}.${expires}`;
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${downloadBase}?p=${productId}&e=${expires}&s=${sig}`;
}

export function validateSignedUrl(p, e, s) {
  const payload = `${p}.${e}`;
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  if (sig !== s) return false;
  return Date.now() < Number(e);
}

export async function getDigitalFilePath(productId) {
  // Map productId to a sample file
  const filePath = path.resolve(__dirname, '../../data/digital', `${productId}.txt`);
  try {
    await fs.access(filePath);
    return filePath;
  } catch {
    return null;
  }
}

