(() => {
  const App = (window.App = window.App || {});

  App.constants = {
    STORAGE_CURRENT_USER: 'floworchestrator_current_user',
    STORAGE_ACCESS_TOKEN: 'floworchestrator_access_token'
  };

  App.storage = {
    read(key) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    },
    write(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        return;
      }
    },
    remove(key) {
      localStorage.removeItem(key);
    }
  };
})();
