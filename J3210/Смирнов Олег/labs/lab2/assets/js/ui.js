(function () {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const paths = window.APP_PATHS || {};

  // Route guard — вызывается на защищённых страницах
  function requireAuth() {
    if (!user) {
      window.location.href = paths.login;
    }
  }

  function logout() {
    localStorage.removeItem('user');
    window.location.href = paths.home;
  }

  function renderNavbar() {
    const actionsEl = document.getElementById('navbarActions');
    if (!actionsEl) return;

    if (user) {
      const initial = user.name.charAt(0).toUpperCase();
      actionsEl.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <div class="avatar" style="width:2em;height:2em;font-size:.85rem;">${initial}</div>
          <span class="text-light small d-none d-md-inline">${user.name}</span>
          <button class="btn btn-outline-light btn-sm" id="logoutBtn">Выйти</button>
        </div>`;
      document.getElementById('logoutBtn').addEventListener('click', logout);
    } else {
      actionsEl.innerHTML = `
        <div class="d-flex gap-2">
          <a href="${paths.login}" class="btn btn-outline-light btn-sm">Войти</a>
          <a href="${paths.register}" class="btn btn-accent btn-sm">Регистрация</a>
        </div>`;
    }
  }

  function renderDashboardProfile() {
    if (!user) return;
    const initial = user.name.charAt(0).toUpperCase();
    document.querySelectorAll('.avatar').forEach(function (el) {
      el.textContent = initial;
    });
    document.querySelectorAll('[data-user-name]').forEach(function (el) {
      el.textContent = user.name;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderNavbar();
    renderDashboardProfile();
  });

  window.AppUI = { requireAuth };
})();
