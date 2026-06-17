function showToast(message) {
  const toastText = document.getElementById('toastText');
  const toastEl = document.getElementById('liveToast');

  if (!toastText || !toastEl || typeof bootstrap === 'undefined') return;

  toastText.textContent = message;
  new bootstrap.Toast(toastEl).show();
}

function initPasswordToggle() {
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');

  if (!toggleButtons.length) return;

  const eyeOpenIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  `;

  const eyeClosedIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 3l18 18"></path>
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"></path>
      <path d="M9.4 5.4A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17.7 17.7 0 0 1-2.2 2.9"></path>
      <path d="M6.7 6.7C4.3 8.2 2.7 10.9 2 12c0 0 3.5 7 10 7a9.8 9.8 0 0 0 5.3-1.5"></path>
    </svg>
  `;

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
    ? `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"></path>
      </svg>
    `
    : `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path>
        <path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path>
        <path d="m19.07 4.93-1.41 1.41"></path>
      </svg>
    `;

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
