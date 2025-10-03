import Stripe from 'stripe';

export async function createStripeIntent({ amount, currency = 'usd' }) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return { clientSecret: 'pi_mock_secret', mock: true };
  }
  const stripe = new Stripe(key, { apiVersion: '2024-06-20' });
  const intent = await stripe.paymentIntents.create({ amount, currency, automatic_payment_methods: { enabled: true } });
  return { clientSecret: intent.client_secret };
}

