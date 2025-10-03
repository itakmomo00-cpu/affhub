import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load env from backend/.env first, then fallback to project root .env
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import app from './src/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`);
});

