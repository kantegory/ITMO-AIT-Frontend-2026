import { AuthApi } from "./api.js";
import { clearAuth, setAuth } from "./storage.js";
import { initTheme } from "./theme.js";
import { initSessionUI } from "./session.js";
import { clearAlert, qs, showAlert } from "./ui.js";

function pickRole(value) {
  return value === "teacher" ? "teacher" : "student";
}

async function handleLogin() {
  const alertBox = qs('[data-auth-alert="login"]');
  clearAlert(alertBox);
  const email = qs("#loginEmail")?.value?.trim();
  const password = qs("#loginPassword")?.value;
  const expectedRole = pickRole(qs("#loginRole")?.value);

  if (!email || !password) {
    showAlert(alertBox, { type: "warning", message: "Заполни email и пароль." });
    return;
  }

  try {
    const data = await AuthApi.login({ email, password });
    const actualRole = data?.user?.role;
    if (expectedRole && actualRole && expectedRole !== actualRole) {
      showAlert(alertBox, {
        type: "warning",
        title: "Неверная роль",
        message:
          expectedRole === "teacher"
            ? "Этот аккаунт не является тренером. Выбери «Студент»."
            : "Этот аккаунт является тренером. Выбери «Тренер».",
      });
      return;
    }
    setAuth(data);
    await initSessionUI();
    const role = data?.user?.role;
    window.location.href = role === "teacher" ? "/teacher.html" : "/student.html";
  } catch (e) {
    showAlert(alertBox, { type: "danger", message: e?.message || "Ошибка входа." });
  }
}

async function handleRegister() {
  const alertBox = qs('[data-auth-alert="register"]');
  clearAlert(alertBox);

  const firstName = qs("#registerFirstName")?.value?.trim();
  const lastName = qs("#registerLastName")?.value?.trim();
  const email = qs("#registerEmail")?.value?.trim();
  const password = qs("#registerPassword")?.value;
  const role = pickRole(qs("#registerRole")?.value);

  if (!email || !password) {
    showAlert(alertBox, { type: "warning", message: "Email и пароль обязательны." });
    return;
  }

  try {
    const data = await AuthApi.register({ firstName, lastName, email, password, role });
    setAuth(data);
    await initSessionUI();
    window.location.href = role === "teacher" ? "/teacher.html" : "/student.html";
  } catch (e) {
    showAlert(alertBox, { type: "danger", message: e?.message || "Ошибка регистрации." });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  await initSessionUI();

  qs("#loginSubmit")?.addEventListener("click", handleLogin);
  qs("#registerSubmit")?.addEventListener("click", handleRegister);

  qs("#login")?.addEventListener("submit", (e) => {
    e.preventDefault();
    handleLogin();
  });
  qs("#register")?.addEventListener("submit", (e) => {
    e.preventDefault();
    handleRegister();
  });

  qs('[data-auth="logout"]')?.addEventListener("click", () => {
    clearAuth();
  });

  qs("#forgotPasswordLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    const alertBox = qs('[data-auth-alert="login"]');
    const email = qs("#loginEmail")?.value?.trim();
    showAlert(alertBox, {
      type: "info",
      title: "Восстановление пароля",
      message: email
        ? `Если аккаунт с email ${email} существует — мы отправили ссылку для восстановления на почту.`
        : "Если аккаунт существует — мы отправили ссылку для восстановления на почту.",
    });
  });
});

