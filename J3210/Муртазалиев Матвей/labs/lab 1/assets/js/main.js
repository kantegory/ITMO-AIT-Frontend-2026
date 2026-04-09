import { initPasswordStrength, initPasswordToggle, initModal, showPageError } from "./ui.js";
import { initDashboardPage } from "./pages/dashboard.js";
import { initIntegrationsPage } from "./pages/integrations.js";
import { initLoginPage } from "./pages/login.js";
import { initRegisterPage } from "./pages/register.js";
import { initReportsPage } from "./pages/reports.js";
import { clearSession, loadSession } from "./session.js";

document.addEventListener("DOMContentLoaded", () => {
  initApp().catch((error) => {
    console.error(error);
    showPageError(error.message || "Не удалось подключиться к API.");
  });
});

async function initApp() {
  initPasswordToggle();
  initPasswordStrength();
  initNavbarAuth();
  initModal("actionModal", {
    "[data-modal-title]": "data-action-title",
    "[data-modal-text]": "data-action-text",
  }, {
    "[data-modal-title]": "Быстрое действие",
    "[data-modal-text]": "",
  });
  initModal("importModal", { "[data-import-provider]": "data-provider" }, {
    "[data-import-provider]": "выбранный аккаунт",
  });

  switch (document.body.dataset.page) {
    case "login":
      initLoginPage();
      return;
    case "register":
      initRegisterPage();
      return;
    case "dashboard":
      await initDashboardPage();
      return;
    case "reports":
      await initReportsPage();
      return;
    case "integrations":
      await initIntegrationsPage();
      return;
    default:
      return;
  }
}

function initNavbarAuth() {
  const session = loadSession();
  const currentPage = document.body.dataset.page;
  const getAriaCurrent = (page) => currentPage === page ? ' aria-current="page"' : "";

  document.querySelectorAll("[data-navbar-auth]").forEach((container) => {
    if (session?.accessToken) {
      container.innerHTML = `
        <a class="btn btn-outline-dark btn-sm px-3" href="./dashboard.html"${getAriaCurrent("dashboard")}>Кабинет</a>
        <button class="btn btn-accent btn-sm px-3" type="button" data-logout-button>Выйти</button>
      `;

      container.querySelector("[data-logout-button]")?.addEventListener("click", () => {
        clearSession();
        window.location.href = "./login.html";
      });

      return;
    }

    container.innerHTML = `
      <a class="btn btn-outline-dark btn-sm px-3" href="./login.html"${getAriaCurrent("login")}>Войти</a>
      <a class="btn btn-accent btn-sm px-3" href="./register.html"${getAriaCurrent("register")}>Регистрация</a>
    `;
  });
}
