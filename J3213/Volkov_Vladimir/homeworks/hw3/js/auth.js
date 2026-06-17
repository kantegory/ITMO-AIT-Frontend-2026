async function initLoginPage() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('passwordInput').value.trim();

    try {
      const users = await apiRequest(
        `/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      );

      if (!users.length) {
        showToast('Неверный e-mail или пароль');
        return;
      }

      await ensureUserFinancialData(users[0].id);

      saveCurrentUser(users[0]);
      showToast('Вход выполнен');

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 500);
    } catch (error) {
      showToast('Не удалось подключиться к серверу');
      console.error(error);
    }
  });
}

async function initRegisterPage() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const agree = document.getElementById('agree').checked;

    if (password !== confirmPassword) {
      showToast('Пароли не совпадают');
      return;
    }

    if (!agree) {
      showToast('Подтвердите согласие с условиями');
      return;
    }

    try {
      const exists = await apiRequest(`/users?email=${encodeURIComponent(email)}`);

      if (exists.length) {
        showToast('Пользователь с таким e-mail уже существует');
        return;
      }

      const createdUser = await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email, password })
      });

      await ensureUserFinancialData(createdUser.id);

      showToast('Регистрация прошла успешно');

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 600);
    } catch (error) {
      showToast('Ошибка при регистрации');
      console.error(error);
    }
  });
}