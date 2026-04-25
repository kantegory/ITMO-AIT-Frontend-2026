(function () {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const paths = window.APP_PATHS || {};

  function requireAuth() {
    if (!user) {
      window.location.href = paths.login;
    }
  }

  function logout() {
    localStorage.removeItem('user');
    window.location.href = paths.home;
  }

  function getThemeIcon() {
    var isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    var sp = window.SPRITE_PATH || 'assets/icons/sprite.svg';
    return isDark
      ? '<svg class="icon" aria-hidden="true"><use href="' + sp + '#sun"></use></svg>'
      : '<svg class="icon" aria-hidden="true"><use href="' + sp + '#moon-stars"></use></svg>';
  }

  function toggleTheme() {
    var isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    var newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    var btn = document.getElementById('themeToggleBtn');
    if (btn) btn.innerHTML = getThemeIcon();
  }

  function renderNavbar() {
    const actionsEl = document.getElementById('navbarActions');
    if (!actionsEl) return;

    var themeBtn = '<button class="btn btn-outline-themed btn-sm" id="themeToggleBtn" title="Переключить тему">' + getThemeIcon() + '</button>';

    if (user) {
      const initial = user.name.charAt(0).toUpperCase();
      actionsEl.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          ${themeBtn}
          <a href="${paths.dashboard}" class="d-flex align-items-center gap-2 text-decoration-none">
            <div class="avatar" style="width:2em;height:2em;font-size:.85rem;">${initial}</div>
            <span class="small d-none d-md-inline" style="color: var(--text);">${user.name}</span>
          </a>
          <button class="btn btn-outline-themed btn-sm" id="logoutBtn">Выйти</button>
        </div>`;
      document.getElementById('logoutBtn').addEventListener('click', logout);
    } else {
      actionsEl.innerHTML = `
        <div class="d-flex gap-2">
          ${themeBtn}
          <a href="${paths.login}" class="btn btn-outline-themed btn-sm">Войти</a>
          <a href="${paths.register}" class="btn btn-accent btn-sm">Регистрация</a>
        </div>`;
    }

    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);
  }

  document.addEventListener('DOMContentLoaded', renderNavbar);

  window.AppUI = { requireAuth };
})();
