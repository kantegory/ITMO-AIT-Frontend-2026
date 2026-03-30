import { loginWithCredentials } from "../auth.js";
import { getPostAuthRedirect } from "../session.js";
import { $ } from "../utils.js";
import { clearMessage, showMessage, toggleBusy } from "../ui.js";

export function initLoginPage() {
  const form = $("[data-auth-form]");
  if (!form) return;

  const message = $("[data-form-message]", form);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage(message);

    const submitButton = $('button[type="submit"]', form);
    const email = $("#loginEmail").value.trim();
    const password = $("#loginPassword").value;

    toggleBusy(submitButton, true, "Входим...");

    try {
      await loginWithCredentials({ email, password });
      window.location.href = getPostAuthRedirect();
    } catch (error) {
      showMessage(message, error.message || "Ошибка входа.");
    } finally {
      toggleBusy(submitButton, false, "Войти в кабинет");
    }
  });
}
