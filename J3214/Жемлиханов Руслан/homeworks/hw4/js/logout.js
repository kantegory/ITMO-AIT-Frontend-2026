(() => {
  const App = (window.App = window.App || {});

  const initLogoutConfirm = () => {
    document.addEventListener('click', (e) => {
      const logoutLink = e.target.closest('[data-logout]');
      if (!logoutLink) return;

      if (!window.confirm('Выйти из аккаунта?')) {
        e.preventDefault();
        return;
      }

      App.storage.remove(App.constants.STORAGE_CURRENT_USER);
      App.storage.remove(App.constants.STORAGE_ACCESS_TOKEN);
    });
  };

  App.logout = {
    init: initLogoutConfirm
  };
})();
