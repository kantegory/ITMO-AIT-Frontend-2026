function saveCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

function requireAuth() {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = "login.html";
  }
}

async function handleRegister(event) {
  event.preventDefault();

  const nameInput = document.querySelector("#name");
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");
  const password2Input = document.querySelector("#password2");
  const messageBlock = document.querySelector("#message");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const password2 = password2Input ? password2Input.value.trim() : "";

  messageBlock.textContent = "";

  if (!name || !email || !password) {
    messageBlock.textContent = "Заполните все поля";
    return;
  }

  if (password2Input && password !== password2) {
    messageBlock.textContent = "Пароли не совпадают";
    return;
  }

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      messageBlock.textContent = "Пользователь с таким email уже существует";
      return;
    }

    const newUser = {
      name: name,
      email: email,
      password: password
    };

    const createdUser = await createUser(newUser);

    saveCurrentUser(createdUser);
    messageBlock.textContent = "Регистрация прошла успешно";

    setTimeout(function () {
      window.location.href = "dashboard.html";
    }, 1000);
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    messageBlock.textContent = "Ошибка при регистрации";
  }
}

async function handleLogin(event) {
  event.preventDefault();

  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");
  const messageBlock = document.querySelector("#message");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  messageBlock.textContent = "";

  if (!email || !password) {
    messageBlock.textContent = "Заполните все поля";
    return;
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      messageBlock.textContent = "Пользователь не найден";
      return;
    }

    if (user.password !== password) {
      messageBlock.textContent = "Неверный пароль";
      return;
    }

    saveCurrentUser(user);
    messageBlock.textContent = "Вход выполнен успешно";

    setTimeout(function () {
      window.location.href = "dashboard.html";
    }, 1000);
  } catch (error) {
    console.error("Ошибка входа:", error);
    messageBlock.textContent = "Ошибка при входе";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.querySelector("#registerForm");
  const loginForm = document.querySelector("#loginForm");
  const logoutBtn = document.querySelector("#logoutBtn");

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
});