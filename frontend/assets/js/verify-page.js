import { i18n } from './i18n.js';
import { api } from './api.js';

const app = document.getElementById('app');
i18n.init();
render();

function render() {
  const phone = localStorage.getItem('pending_phone') || '';
  app.innerHTML = `
    <main class="container">
      <div class="glass form">
        <h1>${i18n.t('verify')}</h1>
        <label>${i18n.t('phone')}<input id="phone" type="tel" value="${phone}" required /></label>
        <div style="display:flex; gap:8px;">
          <button id="send" class="btn">${i18n.t('send_otp')}</button>
        </div>
        <label>${i18n.t('code')}<input id="code" type="text" required /></label>
        <div id="msg" class="error"></div>
        <button id="go" class="btn btn-neon">${i18n.t('verify')}</button>
      </div>
    </main>`;
  document.getElementById('send').onclick = send;
  document.getElementById('go').onclick = submit;
}

async function send() {
  const phone = document.getElementById('phone').value.trim();
  const msg = document.getElementById('msg');
  msg.textContent = '';
  try { await api.sendOtp(phone); msg.textContent = 'OTP sent'; msg.className='success'; } catch (e) { msg.textContent = e.message; msg.className='error'; }
}

async function submit() {
  const phone = document.getElementById('phone').value.trim();
  const code = document.getElementById('code').value.trim();
  const email = localStorage.getItem('pending_email');
  const msg = document.getElementById('msg');
  msg.textContent = '';
  try {
    await api.verifyOtp({ phone, code, email });
    localStorage.removeItem('pending_email');
    localStorage.removeItem('pending_phone');
    location.href = '/account.html';
  } catch (e) { msg.textContent = e.message; }
}

