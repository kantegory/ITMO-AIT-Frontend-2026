const SERVER_ERROR = 'Не удалось подключиться к серверу. Убедитесь, что json-server запущен.';

function saveUserToStorage(user) {
  localStorage.setItem('user', JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    bio: user.bio || '',
    location: user.location || '',
  }));
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('loginError');

    let user;
    try {
      user = await loginUser(email, password);
    } catch {
      errorEl.textContent = SERVER_ERROR;
      errorEl.classList.remove('d-none');
      return;
    }

    if (!user) {
      errorEl.textContent = 'Неверный email или пароль.';
      errorEl.classList.remove('d-none');
      return;
    }

    errorEl.classList.add('d-none');
    saveUserToStorage(user);
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
    const bio = (document.getElementById('bio') || {}).value || '';
    const location = (document.getElementById('location') || {}).value || '';
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const errorEl = document.getElementById('registerError');

    if (password !== passwordConfirm) {
      errorEl.textContent = 'Пароли не совпадают.';
      errorEl.classList.remove('d-none');
      return;
    }

    let existing, user;
    try {
      existing = await getUserByEmail(email);
    } catch {
      errorEl.textContent = SERVER_ERROR;
      errorEl.classList.remove('d-none');
      return;
    }

    if (existing) {
      errorEl.textContent = 'Пользователь с таким email уже существует.';
      errorEl.classList.remove('d-none');
      return;
    }

    try {
      user = await registerUser({ name, email, password, bio, location });
    } catch {
      errorEl.textContent = SERVER_ERROR;
      errorEl.classList.remove('d-none');
      return;
    }

    errorEl.classList.add('d-none');
    saveUserToStorage(user);
    window.location.href = '../dashboard/dashboard.html';
  });
}
