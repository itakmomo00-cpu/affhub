import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loadDb, saveDb, findUserByEmail, findUserByPhone, createUser } from '../services/store.js';
import { sendOtp, verifyOtp } from '../services/otp.js';

const router = Router();

const jwtCookieName = 'session';
const jwtOptions = { httpOnly: true, sameSite: 'lax' /* set secure:true in prod over HTTPS */ };

function setSessionCookie(res, user) {
  const token = jwt.sign({ id: user.id, email: user.email, phone: user.phone }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
  res.cookie(jwtCookieName, token, jwtOptions);
  return token;
}

router.post('/signup', async (req, res) => {
  try {
    const { email, password, phone } = req.body;
    if (!email || !password || !phone) return res.status(400).json({ message: 'Missing fields' });
    const db = await loadDb();
    if (findUserByEmail(db, email)) return res.status(409).json({ message: 'Email already used' });
    if (findUserByPhone(db, phone)) return res.status(409).json({ message: 'Phone already used' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = createUser(db, { email, passwordHash, phone, phoneVerified: false });
    await saveDb(db);
    const otpMeta = await sendOtp(phone);
    res.json({ message: 'OTP sent', otpMeta });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = await loadDb();
    const user = findUserByEmail(db, email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.phoneVerified) return res.status(403).json({ message: 'Phone not verified' });
    const token = setSessionCookie(res, user);
    res.json({ token, user: { id: user.id, email: user.email, phone: user.phone } });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/otp/send', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone required' });
    const meta = await sendOtp(phone);
    res.json({ message: 'OTP sent', meta });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/otp/verify', async (req, res) => {
  try {
    const { phone, code, email } = req.body;
    if (!phone || !code) return res.status(400).json({ message: 'Missing fields' });
    const valid = await verifyOtp(phone, code);
    if (!valid) return res.status(400).json({ message: 'Invalid code' });
    const db = await loadDb();
    let user = findUserByPhone(db, phone);
    if (!user && email) {
      // Edge case: phone-first signup (create minimal user)
      user = createUser(db, { email, phone, phoneVerified: true });
    } else if (user) {
      user.phoneVerified = true;
    }
    await saveDb(db);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const token = setSessionCookie(res, user);
    res.json({ message: 'Phone verified', token });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.session || (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Not authenticated' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const db = await loadDb();
    const user = db.users.find(u => u.id === payload.id);
    if (!user) return res.status(401).json({ message: 'Invalid session' });
    res.json({ user: { id: user.id, email: user.email, phone: user.phone, phoneVerified: user.phoneVerified } });
  } catch (e) {
    res.status(401).json({ message: 'Invalid session' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('session');
  res.json({ message: 'Logged out' });
});

export default router;

