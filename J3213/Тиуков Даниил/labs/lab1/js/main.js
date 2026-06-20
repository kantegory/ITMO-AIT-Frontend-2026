(() => {
    const STORAGE_KEYS = {
        currentUser: "tripplannerCurrentUser",
        registeredUser: "tripplannerRegisteredUser",
        favorites: "tripplannerFavorites",
        routes: "tripplannerRoutes",
        notes: "tripplannerNotes",
        collaborationParticipants: "tripplannerCollaborationParticipants",
        collaborationStages: "tripplannerCollaborationStages",
        collaborationNotes: "tripplannerCollaborationNotes",
        collaborationIdeas: "tripplannerCollaborationIdeas"
    };

    const TravelApp = {
        storageKeys: STORAGE_KEYS,

        getStorage(key, fallbackValue) {
            try {
                const rawValue = localStorage.getItem(key);
                if (rawValue === null) {
                    return fallbackValue;
                }
                return JSON.parse(rawValue);
            } catch (error) {
                console.error(`Не удалось прочитать localStorage по ключу ${key}`, error);
                return fallbackValue;
            }
        },

        setStorage(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error(`Не удалось сохранить localStorage по ключу ${key}`, error);
                return false;
            }
        },

        removeStorage(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error(`Не удалось удалить localStorage по ключу ${key}`, error);
                return false;
            }
        },

        addArrayItem(key, item, compareFn) {
            const collection = this.getStorage(key, []);
            const exists = typeof compareFn === "function"
                ? collection.some((entry) => compareFn(entry, item))
                : collection.includes(item);

            if (!exists) {
                collection.push(item);
                this.setStorage(key, collection);
            }

            return collection;
        },

        removeArrayItem(key, predicate) {
            const collection = this.getStorage(key, []);
            const nextCollection = collection.filter((item) => !predicate(item));
            this.setStorage(key, nextCollection);
            return nextCollection;
        },

        generateId(prefix = "tp") {
            return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
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
            return this.getStorage(STORAGE_KEYS.currentUser, null);
        },

        setCurrentUser(user) {
            this.setStorage(STORAGE_KEYS.currentUser, user);
        },

        clearCurrentUser() {
            this.removeStorage(STORAGE_KEYS.currentUser);
        },

        isAuthenticated() {
            return Boolean(this.getCurrentUser());
        },

        seedCollection(key, defaultValue) {
            if (localStorage.getItem(key) === null) {
                this.setStorage(key, defaultValue);
            }
        },

        initCommonPage() {
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
