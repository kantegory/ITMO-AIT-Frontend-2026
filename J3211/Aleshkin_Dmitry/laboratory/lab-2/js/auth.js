document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const authAlert = document.getElementById('authAlert');
  const brandLinks = document.querySelectorAll('.brand-demo-link');
  const auth = Api.getAuth();

  brandLinks.forEach((link) => {
    link.href = 'index.html';
  });

  if (auth?.userId && (window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('register.html'))) {
    window.location.replace('dashboard.html');
    return;
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;
      try {
        await Api.login(email, password);
        window.location.href = 'dashboard.html';
      } catch (error) {
        showAlert(normalizeError(error), 'danger');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;
      const password2 = document.getElementById('password2').value;

      if (password !== password2) {
        showAlert('Пароли не совпадают', 'warning');
        return;
      }

      try {
        await Api.register({ name, email, password });
        window.location.href = 'dashboard.html';
      } catch (error) {
        showAlert(normalizeError(error), 'danger');
      }
    });
  }

  function normalizeError(error) {
    return /Failed to fetch/i.test(error.message)
      ? 'Не удаётся подключиться к mock API. Сначала запустите json-server командой npm run api.'
      : error.message;
  }

  function showAlert(message, type = 'danger') {
    if (!authAlert) return;
    authAlert.className = `alert alert-${type}`;
    authAlert.textContent = message;
    authAlert.classList.remove('d-none');
  }
});
