(function (global) {
  const form = document.getElementById('loginForm');

  if (!form || !global.KontramarkaAuth) {
    return;
  }

  const { loginUser, isAuthenticated, getAuthErrorMessage } = global.KontramarkaAuth;
  const errorBox = document.getElementById('loginError');
  const submitButton = document.getElementById('loginSubmit');

  function getRedirectTarget() {
    const params = new URLSearchParams(global.location.search);
    return params.get('redirect') || 'index.html';
  }

  function renderError(message) {
    if (!errorBox) {
      return;
    }

    if (!message) {
      errorBox.classList.add('d-none');
      errorBox.textContent = '';
      return;
    }

    errorBox.textContent = message;
    errorBox.classList.remove('d-none');
  }

  function setSubmittingState(isSubmitting) {
    if (!submitButton) {
      return;
    }

    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting ? 'Входим...' : 'Войти';
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    renderError('');

    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');

    if (!email || !password) {
      renderError('Заполните email и пароль.');
      return;
    }

    setSubmittingState(true);

    try {
      await loginUser({ email, password });
      global.location.href = getRedirectTarget();
    } catch (error) {
      console.error('Login failed.', error);

       if (error.code === 'INVALID_CREDENTIALS') {
        renderError('Неверная электронная почта или пароль.');
        return;
      }

      renderError(getAuthErrorMessage(error, 'Не удалось выполнить вход. Проверьте введённые данные.'));
    } finally {
      setSubmittingState(false);
    }
  }

  if (isAuthenticated()) {
    global.location.href = getRedirectTarget();
    return;
  }

  form.addEventListener('submit', handleLoginSubmit);
})(window);
