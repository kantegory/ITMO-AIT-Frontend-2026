document.addEventListener("DOMContentLoaded", () => {
  initLoginForm();
  initRegisterForm();
  initLogout();
});

function initLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const errorBox = document.getElementById("loginError");

    try {
      const users = await apiGet(`/users?email=${encodeURIComponent(email)}`);

      if (users.length === 0) {
        errorBox.textContent = "Пользователь с таким email не найден";
        return;
      }

      const user = users[0];

      if (user.password !== password) {
        errorBox.textContent = "Неверный пароль";
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(user));
      window.location.href = "dashboard.html";
    } catch (error) {
      errorBox.textContent = "Ошибка входа";
      console.error(error);
    }
  });
}

function initRegisterForm() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const repeatPassword = document.getElementById("registerRepeatPassword").value.trim();
    const errorBox = document.getElementById("registerError");

    if (password !== repeatPassword) {
      errorBox.textContent = "Пароли не совпадают";
      return;
    }

    try {
      const existingUsers = await apiGet(`/users?email=${encodeURIComponent(email)}`);

      if (existingUsers.length > 0) {
        errorBox.textContent = "Пользователь с таким email уже существует";
        return;
      }

      const newUser = await apiPost("/users", {
        name,
        email,
        password
      });

      localStorage.setItem("currentUser", JSON.stringify(newUser));
      window.location.href = "dashboard.html";
    } catch (error) {
      errorBox.textContent = "Ошибка регистрации";
      console.error(error);
    }
  });
}

function initLogout() {
  const links = document.querySelectorAll(".logout-link");
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("currentUser");
      window.location.href = "index.html";
    });
  });
}