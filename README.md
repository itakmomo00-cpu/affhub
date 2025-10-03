E-commerce Starter (Dark Neon Gamer, FR/EN)

Overview
This is a full-stack e-commerce starter built with a pure HTML/CSS/JS frontend and a Node.js + Express backend. It ships with:
- Dark neon gamer theme (mobile-first, responsive)
- Bilingual FR/EN with a language switcher (persisted)
- Auth: Phone OTP and Email+Password (with required phone verification)
- Cart for guests (localStorage) and logged-in users (server), with merge on login
- Orders and payments: Stripe (payment intent), PayPal (mock by default), local Maghreb placeholders, Cash On Delivery
- Digital downloads with secure, temporary signed links
- In-memory JSON datastore with sample products/users/orders
- Mock services enabled by default so it runs out-of-the-box

Repo structure
frontend/
  Static pages, CSS, JS modules, and locales
backend/
  Express app, routes, services, and a JSON datastore

Quick start
1) Prerequisites
   - Node.js 18+
   - npm 9+

2) Install dependencies
   cd backend
   npm install

3) Run in development (serves backend API and static frontend)
   npm run dev
   Open http://localhost:3000

4) Optional: run tests
   npm test

Frontend-only dev (optional)
- The backend serves the static frontend by default. If you prefer separate hosting during development, serve the `frontend/` folder with a static server and set API base URLs in `frontend/assets/js/api.js`.

Environment variables
Copy .env.example to backend/.env or project root .env (both supported; backend/.env takes precedence).

Essential variables (safe defaults are provided for local mock mode):
- NODE_ENV=development
- PORT=3000
- JWT_SECRET=change_me_dev
- FRONTEND_DIR=../frontend
- USE_MOCK_OTP=true
- USE_MOCK_PAYPAL=true
- STRIPE_SECRET_KEY= (optional; enable real Stripe when set)
- PAYPAL_CLIENT_ID= (optional)
- PAYPAL_CLIENT_SECRET= (optional)
- ADMIN_USERNAME=admin
- ADMIN_PASSWORD=admin123

Running with mock services (default)
- OTP: A 6-digit code is generated and logged to the server console; responses include a masked hint in development.
- PayPal: Create Order endpoint returns a mock order id; you can simulate success/fail.
- Local Maghreb gateways (Wafacash/Barid): Placeholder endpoints return simulated responses.

Switching to real OTP (Firebase/Twilio)
1) Set USE_MOCK_OTP=false
2) Provide provider credentials via env vars (see code comments in backend/src/services/otp.js). For Firebase, you would set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, etc. For Twilio, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER.
3) Implement the send/verify functions using the provider SDK (locations marked in code).

Stripe integration
- Set STRIPE_SECRET_KEY in backend/.env
- The endpoint POST /api/payments/stripe/intent creates a Payment Intent and returns its client_secret.
- In mock mode (no key present), a fake client_secret is returned.

PayPal integration
- By default, USE_MOCK_PAYPAL=true. For real PayPal:
  - Set USE_MOCK_PAYPAL=false
  - Provide PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET
  - Implement the SDK call in backend/src/services/payments/paypal.js (placeholders provided).

Webhooks (Stripe & PayPal)
- Example webhook endpoints are provided in payments routes. For local testing, use ngrok
  to expose your localhost and configure the webhook to the public URL.

Security notes
- For local demo, JWT is set in an httpOnly cookie (recommended). In production, also set secure cookies and SameSite appropriately and enforce HTTPS. Consider CSRF protection for cookie-based auth.
- Apply a strict Content Security Policy (CSP) and other headers (see app.js for Helmet hint).
- Passwords are hashed with bcryptjs. Do not store plaintext passwords.

Datastore
- A simple JSON file lives at backend/data/db.json. It contains users, products, orders, and carts.
- For production, replace with MongoDB/PostgreSQL. The storage utility is abstracted to ease migration.

Frontend
- Pure HTML/CSS/JS with modular JS (type="module"). Easy to migrate to React later.
- Pages: Home, Products, Product, Cart, Checkout, Account, Auth (login/signup/verify), Admin stub.
- i18n via locales/en.json and locales/fr.json. Language choice persists in localStorage.

Deployment notes
- Render/Heroku: Deploy the backend app; configure it to serve the static frontend directory. Ensure env vars are set. Use managed Postgres/Mongo when going to production.
- Vercel: Host the frontend separately; deploy backend on a server provider (Render/Fly/Heroku). Update the frontend API base URL in frontend/assets/js/api.js.

Runbook (common commands)
- Backend install: cd backend && npm install
- Dev server (serves frontend too): npm run dev
- Start (prod): npm start
- Test: npm test
- Lint (basic): npm run lint (optional stub)

How to enable Phone OTP with Firebase/Twilio
- Set USE_MOCK_OTP=false in .env
- Provide credentials: for Firebase (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY), for Twilio (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER)
- Implement provider calls in backend/src/services/otp.js where marked

How to configure Stripe
- Set STRIPE_SECRET_KEY in backend/.env
- Use POST /api/payments/stripe/intent from checkout UI

How to configure PayPal
- Set USE_MOCK_PAYPAL=false and provide PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET
- Implement SDK usage in backend/src/services/payments/paypal.js where marked

Simulating local Maghreb gateways
- POST /api/payments/local/wafacash and /api/payments/local/barid accept a payload and return simulated success/fail using { simulate: 'success' | 'fail' }

Testing OTP flows
- Sign up with email/password/phone; OTP code logs in server console when using mock mode
Protected routes and sessions
- JWT is stored as httpOnly cookie named `session`. In production, set cookie `secure` and proper `SameSite` values and enforce HTTPS. Consider CSRF tokens.
Notes
- Digital downloads are represented by temporary signed links. For the sample, small text files are included.
- Checkout requires login; cart merges after login.

