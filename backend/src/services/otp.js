const otpStore = new Map();

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendOtp(phone) {
  if (process.env.USE_MOCK_OTP !== 'false') {
    const code = generateCode();
    otpStore.set(phone, { code, expiresAt: Date.now() + 5 * 60 * 1000 });
    // eslint-disable-next-line no-console
    console.log(`[MOCK_OTP] ${phone} -> ${code}`);
    return { mock: true };
  }
  // TODO: Implement real provider (Firebase/Twilio) using env vars
  // For now, we throw to remind configuration
  throw new Error('Real OTP provider not configured');
}

export async function verifyOtp(phone, code) {
  if (process.env.USE_MOCK_OTP !== 'false') {
    const entry = otpStore.get(phone);
    if (!entry) return false;
    const valid = entry.code === code && Date.now() < entry.expiresAt;
    if (valid) otpStore.delete(phone);
    return valid;
  }
  // TODO: Verify using real provider
  return false;
}

