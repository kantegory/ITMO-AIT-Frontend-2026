function setupAuthNavButton() {
  const links = document.querySelectorAll('a[href="login.html"]');
  if (!links.length) return;
  const user = getCurrentUser();

  links.forEach((link) => {
    const text = link.textContent ? link.textContent.trim() : "";
    const isNavAuthButton =
      text === "Войти" ||
      text === "Выйти" ||
      link.classList.contains("btn-outline-primary");
    if (!isNavAuthButton) return;

    if (user) {
      link.textContent = "Выйти";
      link.addEventListener("click", function (e) {
        e.preventDefault();
        logout();
        window.location.href = "login.html";
      });
    } else {
      link.textContent = "Войти";
      link.setAttribute("href", "login.html");
    }
  });
}

function setupAuthForms() {
  setupLoginForm();
  setupRegisterForm();
}

function setupLoginForm() {
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  if (!emailInput || !passwordInput) return;
  const form = emailInput.closest("form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    try {
      const user = await loginUser(emailInput.value.trim(), passwordInput.value);
      if (!user) {
        showToast("Неверный email или пароль");
        return;
      }
      window.location.href = "search.html";
    } catch (error) {
      showToast("Ошибка входа");
    }
  });
}

function setupRegisterForm() {
  const nameInput = document.getElementById("registerName");
  const emailInput = document.getElementById("registerEmail");
  const passwordInput = document.getElementById("registerPassword");
  const passwordConfirmInput = document.getElementById("registerPasswordConfirm");
  if (!nameInput || !emailInput || !passwordInput || !passwordConfirmInput) return;
  const form = nameInput.closest("form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (passwordInput.value !== passwordConfirmInput.value) {
      showToast("Пароли не совпадают");
      return;
    }
    try {
      await registerUser(
        nameInput.value.trim(),
        emailInput.value.trim(),
        passwordInput.value
      );
      showToast("Аккаунт создан, теперь войдите");
      setTimeout(function () {
        window.location.href = "login.html";
      }, 500);
    } catch (error) {
      showToast(error.message || "Ошибка регистрации");
    }
  });
}
