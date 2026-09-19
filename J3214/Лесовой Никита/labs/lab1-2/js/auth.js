document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#loginForm");
  const registerForm = document.querySelector("#registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", login);
  }

  if (registerForm) {
    registerForm.addEventListener("submit", register);
  }
});

async function login(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const result = form.querySelector(".form-result");

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  try {
    showMessage(result, "Проверяем данные…", "info");
    const response = await api.get("/users", {
      params: { email: form.elements.email.value.trim() }
    });
    const user = response.data.find(
      (item) => item.password === form.elements.password.value
    );

    if (!user) {
      showMessage(result, "Неверная почта или пароль.");
      return;
    }

    saveCurrentUser(user);
    showMessage(result, "Вход выполнен. Открываем личный кабинет…", "success");
    window.setTimeout(() => {
      window.location.href = "profile.html";
    }, 600);
  } catch (error) {
    showMessage(result, getApiErrorMessage(error));
  }
}

async function register(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const result = form.querySelector(".form-result");

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  const email = form.elements.email.value.trim();

  try {
    showMessage(result, "Создаём аккаунт…", "info");
    const existing = await api.get("/users", { params: { email } });

    if (existing.data.length > 0) {
      showMessage(result, "Пользователь с такой почтой уже существует.");
      return;
    }

    const response = await api.post("/users", {
      firstName: form.elements.firstName.value.trim(),
      lastName: form.elements.lastName.value.trim(),
      email,
      password: form.elements.password.value,
      city: "Не указан"
    });

    saveCurrentUser(response.data);
    showMessage(result, "Аккаунт создан. Открываем личный кабинет…", "success");
    window.setTimeout(() => {
      window.location.href = "profile.html";
    }, 600);
  } catch (error) {
    showMessage(result, getApiErrorMessage(error));
  }
}
