async function initAuthPage() {
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (!loginForm || !registerForm) {
    return;
  }

  const existingUser = await getCurrentUser();
  if (existingUser) {
    window.location.href = getCabinetUrlForUser(existingUser);
    return;
  }

  const authMessage = document.getElementById("authMessage");
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const rememberMe = document.getElementById("rememberMe");
  const registerName = document.getElementById("registerName");
  const registerEmail = document.getElementById("registerEmail");
  const registerPhone = document.getElementById("registerPhone");
  const registerPassword = document.getElementById("registerPassword");
  const registerPasswordConfirm = document.getElementById("registerPasswordConfirm");

  if (rememberMe) {
    rememberMe.checked = isRememberMeEnabled();
  }

  function showAuthMessage(text, type) {
    if (!authMessage) return;
    authMessage.innerHTML = `<div class="alert alert-${type} py-2 mb-0" role="alert">${escapeHtml(text)}</div>`;
  }

  function clearAuthMessage() {
    if (!authMessage) return;
    authMessage.innerHTML = "";
  }

  if (loginTab && registerTab) {
    function switchToLogin() {
      loginTab.classList.add("active", "btn-primary");
      loginTab.classList.remove("btn-outline-primary");
      registerTab.classList.remove("active", "btn-primary");
      registerTab.classList.add("btn-outline-primary");

      loginForm.classList.remove("d-none");
      registerForm.classList.add("d-none");
      clearAuthMessage();
    }

    function switchToRegister() {
      registerTab.classList.add("active", "btn-primary");
      registerTab.classList.remove("btn-outline-primary");
      loginTab.classList.remove("active", "btn-primary");
      loginTab.classList.add("btn-outline-primary");

      registerForm.classList.remove("d-none");
      loginForm.classList.add("d-none");
      clearAuthMessage();
    }

    loginTab.addEventListener("click", switchToLogin);
    registerTab.addEventListener("click", switchToRegister);
  }

  document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", () => {
      const inputGroup = button.closest(".input-group");
      if (!inputGroup) return;

      const input = inputGroup.querySelector(".password-input");
      if (!input) return;

      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      button.textContent = isPassword ? "Скрыть" : "Показать";
    });
  });

  if (registerPassword && registerPasswordConfirm) {
    function validatePasswordMatch() {
      const isMatch = registerPassword.value === registerPasswordConfirm.value;
      registerPasswordConfirm.setCustomValidity(isMatch ? "" : "Пароли не совпадают");
    }

    registerPassword.addEventListener("input", validatePasswordMatch);
    registerPasswordConfirm.addEventListener("input", validatePasswordMatch);
  }

  document.querySelectorAll(".needs-validation").forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add("was-validated");
    });
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!loginForm.checkValidity()) {
      return;
    }

    const email = loginEmail.value.trim().toLowerCase();
    const password = loginPassword.value;
    const shouldRemember = !!(rememberMe && rememberMe.checked);
    const submitButton = loginForm.querySelector('button[type="submit"]');

    if (submitButton) submitButton.disabled = true;

    try {
      const response = await apiLogin(email, password);
      const user = response.user;
      setCurrentUserId(user.id, { rememberMe: shouldRemember });

      if (shouldRemember) {
        setRememberedUser(user);
      }

      showAuthMessage("Вход выполнен успешно. Переходим в личный кабинет...", "success");
      setTimeout(() => {
        window.location.href = getCabinetUrlForUser(user);
      }, 350);
    } catch (error) {
      showAuthMessage(error.message || "Не получилось войти. Попробуйте позже.", "danger");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!registerForm.checkValidity()) {
      return;
    }

    if (registerPassword.value !== registerPasswordConfirm.value) {
      registerPasswordConfirm.setCustomValidity("Пароли не совпадают");
      registerForm.classList.add("was-validated");
      showAuthMessage("Пароли должны совпадать.", "danger");
      return;
    }

    const email = registerEmail.value.trim().toLowerCase();
    const accountTypeInput = document.querySelector('input[name="accountType"]:checked');
    const accountType = accountTypeInput ? accountTypeInput.value : "buyer";
    const submitButton = registerForm.querySelector('button[type="submit"]');

    if (submitButton) submitButton.disabled = true;

    try {
      const response = await apiRegister({
        name: registerName.value.trim(),
        email,
        phone: registerPhone.value.trim(),
        password: registerPassword.value,
        accountType,
      });

      const newUser = response.user;
      setCurrentUserId(newUser.id, { rememberMe: true });
      setRememberedUser(newUser);

      showAuthMessage("Регистрация успешна. Переходим в личный кабинет...", "success");
      setTimeout(() => {
        window.location.href = getCabinetUrlForUser(newUser);
      }, 350);
    } catch (error) {
      showAuthMessage(error.message || "Не удалось зарегистрироваться. Попробуйте позже.", "danger");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

initAuthPage();
