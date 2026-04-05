(function () {
  function setMessage(text, type) {
    const message = document.getElementById("registerMessage");
    if (!message) return;

    if (!text) {
      message.className = "d-none";
      message.textContent = "";
      return;
    }

    message.className = `alert alert-${type} mt-3 mb-0`;
    message.textContent = text;
  }

  document.addEventListener("DOMContentLoaded", function () {
    Auth.redirectIfAuthenticated("search.html");
    Auth.renderAuthNav();

    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      setMessage("", "info");

      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const role = document.getElementById("role").value.trim();
      const bio = document.getElementById("bio").value.trim();

      if (!firstName || !lastName || !username || !email || !password) {
        setMessage("Заполните все обязательные поля", "warning");
        return;
      }

      try {
        const result = await Api.post("/register", {
          firstName,
          lastName,
          username,
          email,
          password,
          role,
          bio
        });

        Auth.saveSession(result.token, result.user, true);
        setMessage("Аккаунт создан. Перенаправляем в поиск...", "success");

        setTimeout(function () {
          window.location.href = "search.html";
        }, 500);
      } catch (error) {
        setMessage(error.message || "Ошибка регистрации", "danger");
      }
    });
  });
})();
