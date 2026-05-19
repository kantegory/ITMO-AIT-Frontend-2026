(function () {
  function setMessage(text, type) {
    const message = document.getElementById("authMessage");
    if (!message) return;

    if (!text) {
      message.className = "d-none";
      message.textContent = "";
      return;
    }

    message.className = `alert alert-${type} mt-3 mb-0`;
    message.setAttribute("role", type === "danger" || type === "warning" ? "alert" : "status");
    message.textContent = text;
  }

  function resolveReturnTo() {
    const params = new URLSearchParams(window.location.search);
    const returnTo = params.get("returnTo");

    if (!returnTo) return "search.html";
    if (returnTo.includes("://") || returnTo.startsWith("//")) return "search.html";

    return returnTo;
  }

  document.addEventListener("DOMContentLoaded", function () {
    Auth.redirectIfAuthenticated("search.html");
    Auth.renderAuthNav();

    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      setMessage("", "info");

      const login = document.getElementById("login").value.trim();
      const password = document.getElementById("password").value.trim();
      const remember = document.getElementById("remember").checked;

      if (!login || !password) {
        setMessage("Введите логин/email и пароль", "warning");
        return;
      }

      try {
        const result = await Api.post("/login", { login, password });
        Auth.saveSession(result.token, result.user, remember);
        setMessage("Вход выполнен. Перенаправляем...", "success");

        setTimeout(function () {
          window.location.href = resolveReturnTo();
        }, 500);
      } catch (error) {
        setMessage(error.message || "Не удалось выполнить вход", "danger");
      }
    });
  });
})();
