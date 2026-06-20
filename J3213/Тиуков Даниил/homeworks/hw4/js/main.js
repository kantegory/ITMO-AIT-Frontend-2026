(() => {
    const SESSION_KEY = "tripplannerCurrentUser";
    const THEME_KEY = "tripplannerTheme";

    const TravelApp = {
        labelMaps: {
            type: { city: "Город", nature: "Природа", mixed: "Смешанный" },
            budget: { low: "Низкий", medium: "Средний", high: "Высокий" }
        },

        escapeHtml(value) {
            return String(value ?? "")
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;")
                .replaceAll("'", "&#039;");
        },

        formatDate(dateValue = new Date()) {
            const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
            return new Intl.DateTimeFormat("ru-RU", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }).format(date);
        },

        showToast(message, type = "info") {
            const container = this.ensureToastContainer();
            const toastClass = {
                success: "text-bg-success",
                error: "text-bg-danger",
                info: "text-bg-primary"
            }[type] || "text-bg-primary";

            const toastElement = document.createElement("div");
            toastElement.className = `toast align-items-center border-0 ${toastClass}`;
            toastElement.setAttribute("role", "alert");
            toastElement.setAttribute("aria-live", "assertive");
            toastElement.setAttribute("aria-atomic", "true");
            toastElement.innerHTML = `
                <div class="d-flex">
                    <div class="toast-body">${this.escapeHtml(message)}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Закрыть"></button>
                </div>
            `;

            container.appendChild(toastElement);

            const toast = new bootstrap.Toast(toastElement, { delay: 2600 });
            toastElement.addEventListener("hidden.bs.toast", () => toastElement.remove());
            toast.show();
        },

        ensureToastContainer() {
            let container = document.getElementById("toastContainer");
            if (!container) {
                container = document.createElement("div");
                container.id = "toastContainer";
                container.className = "toast-container position-fixed top-0 end-0 p-3";
                document.body.appendChild(container);
            }
            return container;
        },

        highlightActiveNav() {
            const page = document.body.dataset.page;
            document.querySelectorAll("[data-nav]").forEach((link) => {
                link.classList.toggle("active", link.dataset.nav === page);
            });
        },

        syncAuthNavigation() {
            const isAuthorized = this.isAuthenticated();

            document.querySelectorAll("[data-auth-only]").forEach((element) => {
                element.classList.toggle("d-none", !isAuthorized);
            });

            document.querySelectorAll("[data-guest-only]").forEach((element) => {
                element.classList.toggle("d-none", isAuthorized);
            });
        },

        getCurrentUser() {
            try {
                const raw = localStorage.getItem(SESSION_KEY);
                return raw ? JSON.parse(raw) : null;
            } catch {
                return null;
            }
        },

        setCurrentUser(user) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        },

        clearCurrentUser() {
            localStorage.removeItem(SESSION_KEY);
        },

        isAuthenticated() {
            return Boolean(this.getCurrentUser());
        },

        getEffectiveTheme() {
            const saved = localStorage.getItem(THEME_KEY);
            if (saved === "dark" || saved === "light") return saved;
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        },

        applyTheme(theme) {
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem(THEME_KEY, theme);
        },

        initTheme() {
            this.applyTheme(this.getEffectiveTheme());

            const btn = document.getElementById("themeToggle");
            if (btn) {
                btn.addEventListener("click", () => {
                    const current = document.documentElement.getAttribute("data-theme");
                    this.applyTheme(current === "dark" ? "light" : "dark");
                });
            }

            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
                if (!localStorage.getItem(THEME_KEY)) {
                    this.applyTheme(e.matches ? "dark" : "light");
                }
            });
        },

        initCommonPage() {
            this.initTheme();
            this.highlightActiveNav();
            this.syncAuthNavigation();
            this.ensureToastContainer();
        }
    };

    window.TravelApp = TravelApp;

    document.addEventListener("DOMContentLoaded", () => {
        TravelApp.initCommonPage();
    });
})();
