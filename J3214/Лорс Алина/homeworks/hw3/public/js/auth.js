(() => {
  function setError(fieldId, message = '') {
    const target = document.querySelector(`[data-error-for="${fieldId}"]`);
    const field = document.getElementById(fieldId);
    if (target) {
      target.id = target.id || `${fieldId}Error`;
      target.setAttribute('role', 'alert');
      target.setAttribute('aria-live', 'polite');
      target.textContent = message;
    }
    if (field) {
      field.classList.toggle('is-invalid', Boolean(message));
      field.classList.toggle('is-valid', !message && field.value.trim() !== '');
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (target?.id) {
        if (message) field.setAttribute('aria-describedby', target.id);
        else field.removeAttribute('aria-describedby');
      }
    }
  }

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function togglePassword(buttonId, inputId) {
    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);
    if (!button || !input) return;
    button.setAttribute('aria-controls', inputId);
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', 'Показать пароль');
    button.innerHTML = '<i class="bi bi-eye" aria-hidden="true"></i>';
    button.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      button.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
      button.setAttribute('aria-label', isPassword ? 'Скрыть пароль' : 'Показать пароль');
      button.innerHTML = `<i class="bi bi-eye${isPassword ? '-slash' : ''}" aria-hidden="true"></i>`;
    });
  }

  function updatePasswordStrength() {
    const passwordInput = document.getElementById('registerPassword');
    const strengthFill = document.getElementById('passwordStrengthFill');
    const strengthText = document.getElementById('passwordStrengthText');
    if (!passwordInput || !strengthFill || !strengthText) return;
    strengthText.setAttribute('aria-live', 'polite');

    const value = passwordInput.value;
    let score = 0;
    if (value.length >= 6) score += 1;
    if (/[A-ZА-Я]/.test(value)) score += 1;
    if (/[a-zа-я]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-zА-Яа-я0-9]/.test(value)) score += 1;

    const config = {
      0: ['0%', 'var(--bf-danger)', 'Сила пароля: не определена'],
      1: ['20%', 'var(--bf-danger)', 'Сила пароля: слабый'],
      2: ['40%', 'var(--bf-warning)', 'Сила пароля: ниже среднего'],
      3: ['60%', 'var(--bf-primary)', 'Сила пароля: средний'],
      4: ['80%', 'var(--bf-accent)', 'Сила пароля: хороший'],
      5: ['100%', 'var(--bf-success)', 'Сила пароля: сильный']
    };

    const [width, color, label] = config[score];
    strengthFill.style.width = width;
    strengthFill.style.background = color;
    strengthText.textContent = label;
  }

  function initLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    togglePassword('toggleLoginPassword', 'loginPassword');

    const currentUser = window.TarelkaStorage.getCurrentUser();
    if (currentUser && window.TarelkaStorage.getAuthToken()) {
      window.location.href = 'dashboard.html';
      return;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      const remember = document.getElementById('rememberMe').checked;
      let isValid = true;

      setError('loginEmail');
      setError('loginPassword');

      if (!email) {
        setError('loginEmail', 'Введите email.');
        isValid = false;
      } else if (!validateEmail(email)) {
        setError('loginEmail', 'Введите корректный email.');
        isValid = false;
      }

      if (!password) {
        setError('loginPassword', 'Введите пароль.');
        isValid = false;
      }

      if (!isValid) return;

      try {
        await window.TarelkaStorage.login(email, password);
        if (remember) localStorage.setItem('budgetFlowRememberedEmail', email);
        window.TarelkaUI.showToast('Вход выполнен успешно.');
        window.location.href = 'dashboard.html';
      } catch (error) {
        window.TarelkaUI.showToast(error.message, 'danger');
      }
    });

    const remembered = localStorage.getItem('budgetFlowRememberedEmail');
    if (remembered) {
      document.getElementById('loginEmail').value = remembered;
      document.getElementById('rememberMe').checked = true;
    }

    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.TarelkaUI.showToast('Для демо-версии восстановление пароля не реализовано упси-дупси', 'warning');
      });
    }
  }

  function initRegister() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    togglePassword('toggleRegisterPassword', 'registerPassword');
    togglePassword('toggleConfirmPassword', 'confirmPassword');

    const passwordInput = document.getElementById('registerPassword');
    if (passwordInput) passwordInput.addEventListener('input', updatePasswordStrength);

    const currentUser = window.TarelkaStorage.getCurrentUser();
    if (currentUser && window.TarelkaStorage.getAuthToken()) {
      window.location.href = 'dashboard.html';
      return;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const payload = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('registerEmail').value.trim(),
        password: document.getElementById('registerPassword').value.trim(),
        confirmPassword: document.getElementById('confirmPassword').value.trim(),
        currency: document.getElementById('currency').value,
        monthlyGoal: document.getElementById('monthlyGoal').value,
        termsAgreement: document.getElementById('termsAgreement').checked
      };

      ['firstName', 'lastName', 'registerEmail', 'registerPassword', 'confirmPassword', 'termsAgreement'].forEach((fieldId) => setError(fieldId));

      let isValid = true;
      if (!payload.firstName) {
        setError('firstName', 'Введите имя.');
        isValid = false;
      }
      if (!payload.lastName) {
        setError('lastName', 'Введите фамилию.');
        isValid = false;
      }
      if (!payload.email) {
        setError('registerEmail', 'Введите email.');
        isValid = false;
      } else if (!validateEmail(payload.email)) {
        setError('registerEmail', 'Введите корректный email.');
        isValid = false;
      }
      if (payload.password.length < 6) {
        setError('registerPassword', 'Пароль должен содержать минимум 6 символов.');
        isValid = false;
      }
      if (payload.password !== payload.confirmPassword) {
        setError('confirmPassword', 'Пароли не совпадают.');
        isValid = false;
      }
      if (!payload.termsAgreement) {
        setError('termsAgreement', 'Необходимо согласиться с условиями.');
        isValid = false;
      }
      if (!isValid) return;

      try {
        await window.TarelkaStorage.registerUser(payload);
        window.TarelkaUI.showToast('Регистрация прошла успешно. Кабинет заполнен демо-данными из mock API.');
        window.location.href = 'dashboard.html';
      } catch (error) {
        window.TarelkaUI.showToast(error.message, 'danger');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initLogin();
    initRegister();
  });
})();
