document.addEventListener("DOMContentLoaded", () => {
  const app = window.Lab1App;
  if (!app) return;

  document.getElementById("loginForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail")?.value.trim() || "";
    const password = document.getElementById("loginPassword")?.value || "";
    const role = document.getElementById("loginRole")?.value || "tenant";

    if (!email || !password) {
      app.showToast("Пожалуйста, введите email и пароль.");
      return;
    }

    try {
      const user = await app.loginUser(email, password);
      if (user.role !== role) {
        app.clearAuth();
        app.showToast("Выбранная роль не соответствует учетной записи.");
        return;
      }

      app.showToast(`Добро пожаловать, ${user.name || user.email}.`);
      window.location.href = app.cabinetLink(user.role);
    } catch (error) {
      app.showToast(error?.message || "Не удалось выполнить вход. Попробуйте позже.");
    }
  });
});
