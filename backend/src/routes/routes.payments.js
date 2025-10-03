import { Router } from 'express';
import { createStripeIntent } from '../services/payments/stripe.js';
import { createPaypalOrder } from '../services/payments/paypal.js';

const router = Router();

router.post('/stripe/intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const result = await createStripeIntent({ amount, currency: currency || 'usd' });
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: 'Stripe error' });
  }
});

router.post('/paypal/create-order', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const result = await createPaypalOrder({ amount, currency: currency || 'USD' });
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: 'PayPal error' });
  }
});

router.post('/local/wafacash', async (req, res) => {
  // Placeholder success/fail simulation
  const { simulate } = req.body || {};
  if (simulate === 'fail') return res.status(400).json({ message: 'Wafacash failed (simulated)' });
  res.json({ status: 'success', provider: 'wafacash' });
});

router.post('/local/barid', async (req, res) => {
  const { simulate } = req.body || {};
  if (simulate === 'fail') return res.status(400).json({ message: 'Barid failed (simulated)' });
  res.json({ status: 'success', provider: 'barid' });
});

// Webhook stubs
router.post('/stripe/webhook', (req, res) => {
  // For real usage, verify signature using Stripe-Signature header and webhook secret
  res.json({ received: true });
});

router.post('/paypal/webhook', (req, res) => {
  // Verify webhook signature per PayPal docs when using real integration
  res.json({ received: true });
});

export default router;

