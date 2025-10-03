export async function createPaypalOrder({ amount, currency = 'USD' }) {
  if (process.env.USE_MOCK_PAYPAL !== 'false') {
    return { id: `MOCK-PAYPAL-${Date.now()}`, status: 'CREATED', mock: true };
  }
  // TODO: Implement using @paypal/checkout-server-sdk with PAYPAL_CLIENT_ID/SECRET
  throw new Error('Real PayPal not configured');
}

