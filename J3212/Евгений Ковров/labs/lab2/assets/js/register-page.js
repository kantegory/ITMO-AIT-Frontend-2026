(function (global) {
  const form = document.getElementById('registerForm');

  if (!form || !global.KontramarkaAuth) {
    return;
  }

  const { registerUser, isAuthenticated, getAuthErrorMessage } = global.KontramarkaAuth;
  const errorBox = document.getElementById('registerError');
  const submitButton = document.getElementById('registerSubmit');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    submitButton.textContent = isSubmitting ? 'Создаём аккаунт...' : 'Создать аккаунт';
  }

  function validateRegisterForm({ name, email, password, confirmPassword, agreed }) {
    if (!name || !email || !password || !confirmPassword) {
      return 'Заполните все обязательные поля.';
    }

    if (!emailPattern.test(email)) {
      return 'Введите корректный email.';
    }

    if (password.length < 6) {
      return 'Пароль должен содержать минимум 6 символов.';
    }

    if (password !== confirmPassword) {
      return 'Пароли не совпадают.';
    }

    if (!agreed) {
      return 'Подтвердите согласие с условиями сервиса.';
    }

    return '';
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    renderError('');

    const formData = new FormData(form);
    const firstName = String(formData.get('firstName') || '').trim();
    const lastName = String(formData.get('lastName') || '').trim();
    const name = [firstName, lastName].filter(Boolean).join(' ').trim();
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');
    const confirmPassword = String(formData.get('confirmPassword') || '');
    const agreed = formData.get('terms') === 'on';

    const validationError = validateRegisterForm({
      name,
      email,
      password,
      confirmPassword,
      agreed
    });

    if (validationError) {
      renderError(validationError);
      return;
    }

    setSubmittingState(true);

    try {
      await registerUser({ name, email, password });
      global.location.href = 'index.html';
    } catch (error) {
      console.error('Registration failed.', error);

      if (error.code === 'EMAIL_EXISTS') {
        renderError('Пользователь с такой электронной почтой уже существует.');
        return;
      }

      renderError(getAuthErrorMessage(error, 'Не удалось зарегистрироваться. Проверьте введённые данные.'));
    } finally {
      setSubmittingState(false);
    }
  }

  if (isAuthenticated()) {
    global.location.href = 'index.html';
    return;
  }

  form.addEventListener('submit', handleRegisterSubmit);
})(window);
