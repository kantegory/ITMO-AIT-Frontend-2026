(function (global) {
  function getAuthNavContainer() {
    return document.querySelector('[data-auth-nav]');
  }

  function getCurrentPage() {
    const pathParts = global.location.pathname.split('/');
    return pathParts[pathParts.length - 1] || 'index.html';
  }

  function renderGuestNav(container) {
    container.innerHTML = `
      <a class="btn btn-outline-secondary${getCurrentPage() === 'login.html' ? ' active' : ''}" href="login.html">Войти</a>
      <a class="btn btn-primary${getCurrentPage() === 'register.html' ? ' active' : ''}" href="register.html">Регистрация</a>
    `;
  }

  function renderUserNav(container, user) {
    const ticketsLinkClass = getCurrentPage() === 'orders.html'
      ? 'btn btn-outline-primary active'
      : 'btn btn-outline-primary';

    container.innerHTML = `
      <span class="navbar-text text-secondary small me-1 icon-text">
        <svg class="icon" aria-hidden="true">
          <use href="assets/icons/sprite.svg#icon-user"></use>
        </svg>
        <span>${user.name}</span>
      </span>
      <a class="${ticketsLinkClass}" href="orders.html">Мои билеты</a>
      <button class="btn btn-outline-secondary" type="button" data-auth-logout>Выйти</button>
    `;
  }

  function renderAuthNav() {
    const container = getAuthNavContainer();

    if (!container || !global.KontramarkaAuth) {
      return;
    }

    if (global.KontramarkaAuth.isAuthenticated()) {
      renderUserNav(container, global.KontramarkaAuth.getCurrentUser());
      return;
    }

    renderGuestNav(container);
  }

  document.addEventListener('click', (event) => {
    const logoutButton = event.target.closest('[data-auth-logout]');

    if (!logoutButton || !global.KontramarkaAuth) {
      return;
    }

    global.KontramarkaAuth.logoutUser();
    renderAuthNav();
    global.location.href = 'index.html';
  });

  global.KontramarkaAuthUi = {
    renderAuthNav
  };

  renderAuthNav();
})(window);
