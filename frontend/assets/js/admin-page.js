import { i18n } from './i18n.js';
import { api } from './api.js';

const app = document.getElementById('app');
i18n.init();
render();

function render() {
  app.innerHTML = `
    <main class="container">
      <div class="glass form">
        <h1>${i18n.t('admin')}</h1>
        <label>Username<input id="u" /></label>
        <label>Password<input id="p" type="password" /></label>
        <button id="go" class="btn btn-neon">Login</button>
        <div id="msg" class="error"></div>
        <pre id="out" class="glass" style="overflow:auto"></pre>
      </div>
    </main>`;
  document.getElementById('go').onclick = submit;
}

async function submit() {
  const u = document.getElementById('u').value;
  const p = document.getElementById('p').value;
  const msg = document.getElementById('msg');
  const out = document.getElementById('out');
  msg.textContent = '';
  try {
    const data = await api.adminOverview(u, p);
    out.textContent = JSON.stringify(data, null, 2);
  } catch (e) { msg.textContent = e.message; }
}

