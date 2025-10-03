import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import fs from 'fs';

import { apiRouter } from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Basic security and parsing
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// Serve static frontend directory (default ../frontend)
const FRONTEND_DIR = process.env.FRONTEND_DIR || '../../frontend';
const staticDir = path.resolve(__dirname, FRONTEND_DIR);
if (fs.existsSync(staticDir)) {
  app.use(express.static(staticDir));
}

// API routes
app.use('/api', apiRouter);

// Fallback to index.html for basic client-side navigation
app.get('*', (req, res) => {
  if (fs.existsSync(path.join(staticDir, 'index.html'))) {
    res.sendFile(path.join(staticDir, 'index.html'));
  } else {
    res.json({ ok: true });
  }
});

export default app;

