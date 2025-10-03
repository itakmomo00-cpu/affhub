import { i18n } from './i18n.js';
import { api } from './api.js';

const app = document.getElementById('app');
i18n.init();
render();

function render() {
  app.innerHTML = `
    <main class="container">
      <div class="glass form">
        <h1>${i18n.t('signup')}</h1>
        <label>${i18n.t('email')}<input id="email" type="email" required /></label>
        <label>${i18n.t('password')}<input id="pwd" type="password" required minlength="6" /></label>
        <label>${i18n.t('phone')}<input id="phone" type="tel" required /></label>
        <div id="msg" class="error"></div>
        <button id="go" class="btn btn-neon">${i18n.t('signup')}</button>
      </div>
    </main>`;
  document.getElementById('go').onclick = submit;
}

async function submit() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('pwd').value;
  const phone = document.getElementById('phone').value.trim();
  const msg = document.getElementById('msg');
  msg.textContent = '';
  if (!email || !password || !phone) { msg.textContent = 'Fill all fields'; return; }
  try {
    await api.signup({ email, password, phone });
    localStorage.setItem('pending_email', email);
    localStorage.setItem('pending_phone', phone);
    location.href = '/verify.html';
  } catch (e) { msg.textContent = e.message; }
}

