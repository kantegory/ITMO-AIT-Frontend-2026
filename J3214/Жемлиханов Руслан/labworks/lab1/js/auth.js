(() => {
  const App = (window.App = window.App || {});

  const setSession = (payload) => {
    if (!payload?.accessToken || !payload?.user) return;
    App.storage.write(App.constants.STORAGE_ACCESS_TOKEN, payload.accessToken);
    App.storage.write(App.constants.STORAGE_CURRENT_USER, payload.user);
  };

  const notify = (message) => {
    const toastEl = document.getElementById('actionToast');
    if (toastEl) {
      App.ui.showToast(message);
      return;
    }
    window.alert(message);
  };

  const isPublicPage = () => {
    const file = window.location.pathname.split('/').pop() || 'index.html';
    return file === 'index.html' || file === 'register.html';
  };

  const hasSession = () => {
    const token = App.storage.read(App.constants.STORAGE_ACCESS_TOKEN);
    return Boolean(token);
  };

  const initAuthGuard = () => {
    if (isPublicPage()) return;
    if (!hasSession()) {
      window.location.href = 'index.html';
    }
  };

  const initCurrentUserUI = () => {
    const currentUser = App.storage.read(App.constants.STORAGE_CURRENT_USER);
    if (!currentUser || !currentUser.name) return;

    document.querySelectorAll('[data-current-user-name]').forEach((el) => {
      el.textContent = currentUser.name;
    });

    document.querySelectorAll('[data-current-user-greeting]').forEach((el) => {
      el.textContent = currentUser.name.split(' ')[0];
    });
  };

  const initLoginPage = () => {
    const form = document.getElementById('loginForm');
    const loginField = document.getElementById('loginField');
    const passwordField = document.getElementById('passwordField');
    if (!form || !loginField || !passwordField) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      try {
        const payload = await App.api.login({
          email: loginField.value.trim(),
          password: passwordField.value
        });

        setSession(payload);
        window.location.href = 'dashboard.html';
      } catch (error) {
        notify(`Ошибка входа: ${error.message}`);
      }
    });
  };

  const initPasswordToggle = () => {
    document.querySelectorAll('[data-password-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (!target) return;
        const isPassword = target.type === 'password';
        target.type = isPassword ? 'text' : 'password';
        btn.textContent = isPassword ? 'Скрыть' : 'Показать';
      });
    });
  };

  const initRegisterValidation = () => {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const regPassword = document.getElementById('regPassword');
      const confirmPassword = document.getElementById('confirmPassword');
      const regPasswordError = document.getElementById('regPasswordError');
      const confirmPasswordError = document.getElementById('confirmPasswordError');

      regPasswordError.textContent = '';
      confirmPasswordError.textContent = '';

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      let valid = true;
      if (regPassword.value.length < 6) {
        regPassword.classList.add('is-invalid');
        regPasswordError.textContent = 'Пароль должен быть не менее 6 символов.';
        valid = false;
      } else {
        regPassword.classList.remove('is-invalid');
      }

      if (regPassword.value !== confirmPassword.value) {
        confirmPassword.classList.add('is-invalid');
        confirmPasswordError.textContent = 'Пароли не совпадают.';
        valid = false;
      } else {
        confirmPassword.classList.remove('is-invalid');
      }

      if (!valid) return;

      try {
        const payload = await App.api.register({
          name: document.getElementById('name').value.trim(),
          email: document.getElementById('email').value.trim(),
          password: regPassword.value,
          team: document.getElementById('team').value.trim()
        });

        setSession(payload);
        App.ui.showToast('Регистрация успешно выполнена.');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 700);
      } catch (error) {
        notify(`Ошибка регистрации: ${error.message}`);
      }
    });
  };

  App.auth = {
    initAuthGuard,
    initCurrentUserUI,
    initLoginPage,
    initPasswordToggle,
    initRegisterValidation
  };
})();
