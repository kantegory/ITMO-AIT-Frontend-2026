import { apiRequest } from "../api.js";
import { buildSession, seedUserData } from "../auth.js";
import { saveSession } from "../session.js";
import { $ } from "../utils.js";
import { clearMessage, showMessage, toggleBusy } from "../ui.js";

export function initRegisterPage() {
  const form = $("[data-register-form]");
  if (!form) return;

  const message = $("[data-form-message]", form);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage(message);

    const submitButton = $('button[type="submit"]', form);
    const payload = {
      firstName: $("#firstName").value.trim(),
      lastName: $("#lastName").value.trim(),
      email: $("#registerEmail").value.trim(),
      password: $("#registerPassword").value,
      plan: $('input[name="plan"]:checked', form)?.value || "Starter",
    };

    toggleBusy(submitButton, true, "Создаем аккаунт...");

    try {
      const response = await apiRequest("/register", {
        method: "POST",
        auth: false,
        body: payload,
      });
      const session = await buildSession(response.accessToken, response.user);
      saveSession(session);
      await seedUserData(session.user, payload.plan);
      window.location.href = "./dashboard.html";
    } catch (error) {
      showMessage(message, error.message || "Регистрация не удалась.");
    } finally {
      toggleBusy(submitButton, false, "Зарегистрироваться");
    }
  });
}
