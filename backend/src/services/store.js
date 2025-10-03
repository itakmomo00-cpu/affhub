import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '../../data/db.json');

export async function loadDb() {
  try {
    const content = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    return { users: [], products: [], orders: [], carts: {} };
  }
}

export async function saveDb(db) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

export function findUserByEmail(db, email) {
  return db.users.find(u => u.email?.toLowerCase() === String(email).toLowerCase());
}

export function findUserByPhone(db, phone) {
  return db.users.find(u => u.phone === phone);
}

export function createUser(db, { email, passwordHash = null, phone, phoneVerified = false, role = 'user' }) {
  const user = {
    id: uuidv4(),
    email: email || null,
    passwordHash,
    phone,
    phoneVerified,
    role,
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  return user;
}

