import en from '../../locales/en.json' assert { type: 'json' };
import fr from '../../locales/fr.json' assert { type: 'json' };

const KEY = 'lang';

function current() {
  return localStorage.getItem(KEY) || (navigator.language || 'en').startsWith('fr') ? 'fr' : 'en';
}

let langCode = current();

export const i18n = {
  init() {
    this.apply();
  },
  lang() { return langCode; },
  set(code) { langCode = code; localStorage.setItem(KEY, code); this.apply(); },
  toggle() { this.set(langCode === 'en' ? 'fr' : 'en'); },
  t(key) {
    const dict = langCode === 'fr' ? fr : en;
    return dict[key] || key;
  },
  tName(nameObj) {
    if (!nameObj) return '';
    return (langCode === 'fr' ? nameObj.fr : nameObj.en) || nameObj.en || nameObj.fr || '';
  },
  apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
  }
};

