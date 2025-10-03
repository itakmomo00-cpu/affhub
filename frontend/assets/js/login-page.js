import { i18n } from './i18n.js';
import { api } from './api.js';

const app = document.getElementById('app');
i18n.init();
render();

function render() {
  app.innerHTML = `
    <main class="container">
      <div class="glass form">
        <h1>${i18n.t('login')}</h1>
        <label>${i18n.t('email')}<input id="email" type="email" required /></label>
        <label>${i18n.t('password')}<input id="pwd" type="password" required /></label>
        <div id="msg" class="error"></div>
        <button id="go" class="btn btn-neon">${i18n.t('login')}</button>
        <a href="/signup.html">${i18n.t('signup')}</a>
      </div>
    </main>`;
  document.getElementById('go').onclick = submit;
}

async function submit() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('pwd').value;
  const msg = document.getElementById('msg');
  msg.textContent = '';
  try {
    await api.login({ email, password });
    const next = new URLSearchParams(location.search).get('next') || '/account.html';
    location.href = next;
  } catch (e) { msg.textContent = e.message; }
}

