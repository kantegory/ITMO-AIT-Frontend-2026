export function setupTheme() {
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const button = document.createElement("button");

    document.documentElement.dataset.theme = savedTheme || systemTheme;
    button.className = "btn btn-light btn-sm theme-toggle";
    button.type = "button";

    const updateButton = () => {
        const label = document.documentElement.dataset.theme === "dark" ? "Светлая" : "Тёмная";
        button.innerHTML = `<svg class="icon" aria-hidden="true"><use href="sprite.svg#theme"></use></svg>${label}`;
        button.setAttribute("aria-label", `Включить тему: ${label.toLowerCase()}`);
    };

    button.onclick = () => {
        const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = nextTheme;
        localStorage.setItem("theme", nextTheme);
        updateButton();
    };

    updateButton();

    const topbar = document.querySelector(".topbar");
    const authActions = document.querySelector("header .ms-auto");
    if (topbar) {
        const actions = document.createElement("div");
        const mainAction = topbar.querySelector(".upload-btn, #saveSettingsBtn");

        actions.className = "ms-auto d-flex align-items-center gap-2";
        if (mainAction) actions.appendChild(mainAction);
        actions.appendChild(button);
        topbar.appendChild(actions);
    }
    if (authActions) authActions.prepend(button);
}
