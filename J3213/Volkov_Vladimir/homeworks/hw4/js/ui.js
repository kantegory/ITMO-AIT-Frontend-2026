function showToast(message) {
  const toastText = document.getElementById('toastText');
  const toastEl = document.getElementById('liveToast');

  if (!toastText || !toastEl || typeof bootstrap === 'undefined') return;

  toastText.textContent = message;
  new bootstrap.Toast(toastEl).show();
}

const SVG_SPRITE_PATH = 'assets/icons-sprite.svg';

function getSpriteIconMarkup(iconId, options = {}) {
  const { width = 18, height = 18, ariaHidden = false } = options;
  const ariaHiddenAttr = ariaHidden ? ' aria-hidden="true"' : '';

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24" fill="none"${ariaHiddenAttr}>
      <use href="${SVG_SPRITE_PATH}#${iconId}"></use>
    </svg>
  `;
}

function initPasswordToggle() {
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');

  if (!toggleButtons.length) return;

  const eyeOpenIcon = getSpriteIconMarkup('icon-eye');
  const eyeClosedIcon = getSpriteIconMarkup('icon-eye-off');

  toggleButtons.forEach((button) => {
    const targetId = button.dataset.target;
    const input = document.getElementById(targetId);
    const icon = button.querySelector('.eye-icon');

    if (!input || !icon) return;

    button.addEventListener('click', () => {
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      icon.innerHTML = isHidden ? eyeClosedIcon : eyeOpenIcon;
    });
  });
}

function logoutUser() {
  clearCurrentUser();
  window.location.href = 'login.html';
}

function initLogoutButton() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn) return;

  logoutBtn.onclick = logoutUser;
}

const THEME_STORAGE_KEY = 'moneyflow-theme';

function getPreferredTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getThemeButtonMarkup(theme) {
  const isDark = theme === 'dark';
  const icon = isDark
    ? getSpriteIconMarkup('icon-moon', { ariaHidden: true })
    : getSpriteIconMarkup('icon-sun', { ariaHidden: true });

  return `<span class="theme-toggle-icon">${icon}</span><span>${isDark ? 'Тёмная тема' : 'Светлая тема'}</span>`;
}

function setTheme(theme, options = {}) {
  const { dispatchEvent = true } = options;
  const nextTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);

  const button = document.getElementById('themeToggleBtn');
  if (button) {
    button.innerHTML = getThemeButtonMarkup(nextTheme);
    button.setAttribute('aria-label', nextTheme === 'dark' ? 'Включена тёмная тема. Нажмите, чтобы переключить на светлую тему' : 'Включена светлая тема. Нажмите, чтобы переключить на тёмную тему');
    button.setAttribute('aria-pressed', String(nextTheme === 'dark'));
  }

  if (dispatchEvent) {
    document.dispatchEvent(new CustomEvent('moneyflow-theme-changed', {
      detail: { theme: nextTheme }
    }));
  }
}

function initThemeToggle() {
  const navMenu = document.getElementById('navMenu');
  if (!navMenu || document.getElementById('themeToggleBtn')) {
    setTheme(getPreferredTheme(), { dispatchEvent: false });
    return;
  }

  const navList = navMenu.querySelector('.navbar-nav');
  if (!navList) {
    setTheme(getPreferredTheme(), { dispatchEvent: false });
    return;
  }

  const item = document.createElement('li');
  item.className = 'nav-item theme-switch-item';
  item.innerHTML = `
    <button class="theme-toggle-btn" id="themeToggleBtn" type="button" aria-live="polite"></button>
  `;
  navList.appendChild(item);

  const initialTheme = getPreferredTheme();
  setTheme(initialTheme, { dispatchEvent: false });

  const themeButton = document.getElementById('themeToggleBtn');
  if (!themeButton) return;

  themeButton.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}
