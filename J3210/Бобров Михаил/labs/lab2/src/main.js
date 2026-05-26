import { exposeActions, setupActions } from "./actions.js";
import { isAuthPage, requireAuth, setupAuthForms, setupLogout } from "./auth.js";
import { renderAll } from "./render.js";
import { setupSettings } from "./settings.js";
import { loadState } from "./state.js";

setupAuthForms();

if (requireAuth() && !isAuthPage()) {
    startApp();
}

async function startApp() {
    exposeActions();
    setupLogout();

    try {
        await loadState();
        renderAll();
        setupActions();
        setupSettings();
    } catch (error) {
        alert("Не удалось подключиться к моковому API. Запустите npm run api");
    }
}
