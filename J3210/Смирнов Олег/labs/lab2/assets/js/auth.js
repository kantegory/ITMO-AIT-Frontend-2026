// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('loginError');

    const user = await loginUser(email, password);

    if (!user) {
      errorEl.textContent = 'Неверный email или пароль.';
      errorEl.classList.remove('d-none');
      return;
    }

    errorEl.classList.add('d-none');
    localStorage.setItem('user', JSON.stringify({ id: user.id, name: user.name, email: user.email }));
    window.location.href = '../dashboard/dashboard.html';
  });
}

// Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const errorEl = document.getElementById('registerError');

    if (password !== passwordConfirm) {
      errorEl.textContent = 'Пароли не совпадают.';
      errorEl.classList.remove('d-none');
      return;
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      errorEl.textContent = 'Пользователь с таким email уже существует.';
      errorEl.classList.remove('d-none');
      return;
    }

    errorEl.classList.add('d-none');
    const user = await registerUser({ name, email, password });
    localStorage.setItem('user', JSON.stringify({ id: user.id, name: user.name, email: user.email }));
    window.location.href = '../dashboard/dashboard.html';
  });
}
