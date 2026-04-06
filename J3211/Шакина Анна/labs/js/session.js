document.addEventListener("DOMContentLoaded", () => {
    const auth = window.SchoolAuth;
    const THEME_STORAGE_KEY = "themePreference";
    const THEME_OPTIONS = ["auto", "light", "dark"];
    const themeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const getStoredThemePreference = () => {
        const storedValue = localStorage.getItem(THEME_STORAGE_KEY);
        return THEME_OPTIONS.includes(storedValue) ? storedValue : "auto";
    };

    const getResolvedTheme = (preference) => {
        if (preference === "light" || preference === "dark") {
            return preference;
        }

        return themeMediaQuery.matches ? "dark" : "light";
    };

    const applyThemePreference = (preference) => {
        const resolvedTheme = getResolvedTheme(preference);
        document.documentElement.setAttribute("data-theme", resolvedTheme);
        document.documentElement.style.colorScheme = resolvedTheme;
    };

    const syncThemeSwitcher = (preference) => {
        const switcher = document.querySelector("[data-theme-switcher]");
        if (switcher) {
            switcher.value = preference;
        }
    };

    const setThemePreference = (preference) => {
        const normalizedPreference = THEME_OPTIONS.includes(preference) ? preference : "auto";
        localStorage.setItem(THEME_STORAGE_KEY, normalizedPreference);
        applyThemePreference(normalizedPreference);
        syncThemeSwitcher(normalizedPreference);
    };

    const createThemeSwitcher = () => {
        if (document.querySelector("[data-theme-switcher]")) {
            syncThemeSwitcher(getStoredThemePreference());
            return;
        }

        const footerRow = document.querySelector(".footer-row");
        if (!footerRow) {
            return;
        }

        const label = document.createElement("label");
        label.className = "footer-theme-switcher";
        label.style.display = "inline-flex";
        label.style.alignItems = "center";
        label.style.gap = "0.5rem";

        const select = document.createElement("select");
        select.setAttribute("data-theme-switcher", "");
        select.className = "form-select form-select-sm";
        select.style.width = "auto";

        [
            { value: "auto", label: "Авто" },
            { value: "light", label: "Светлая" },
            { value: "dark", label: "Тёмная" }
        ].forEach((optionConfig) => {
            const option = document.createElement("option");
            option.value = optionConfig.value;
            option.textContent = optionConfig.label;
            select.append(option);
        });

        select.addEventListener("change", (event) => {
            setThemePreference(event.target.value);
        });

        label.append(select);
        footerRow.insertBefore(label, footerRow.firstElementChild?.nextElementSibling || null);
        syncThemeSwitcher(getStoredThemePreference());
    };

    const handleSystemThemeChange = () => {
        const preference = getStoredThemePreference();
        if (preference === "auto") {
            applyThemePreference(preference);
            syncThemeSwitcher(preference);
        }
    };

    applyThemePreference(getStoredThemePreference());
    createThemeSwitcher();
    if (typeof themeMediaQuery.addEventListener === "function") {
        themeMediaQuery.addEventListener("change", handleSystemThemeChange);
    } else if (typeof themeMediaQuery.addListener === "function") {
        themeMediaQuery.addListener(handleSystemThemeChange);
    }

    if (!auth) {
        return;
    }

    const currentUser = auth.getCurrentUser();
    const accessToken = localStorage.getItem("accessToken");
    const isLoggedIn = Boolean(accessToken && currentUser?.id);
    const pageName = window.location.pathname.split("/").pop() || "index.html";
    const protectedPages = ["profile.html", "teacher.html", "admin.html"];

    if (!isLoggedIn && protectedPages.includes(pageName)) {
        auth.logout();
        window.location.href = "login.html";
        return;
    }

    if (isLoggedIn && pageName === "login.html") {
        auth.redirectToUserHome(currentUser);
        return;
    }

    document.querySelectorAll('a[href="profile.html"]').forEach((link) => {
        link.setAttribute("href", isLoggedIn ? auth.getHomePageForUser(currentUser) : "profile.html");
    });

    document.querySelectorAll("[data-proposal-link]").forEach((link) => {
        link.setAttribute("href", auth.PROPOSAL_FORM_URL);
    });

    document.querySelectorAll(".login-button").forEach((button) => {
        if (!isLoggedIn) {
            button.textContent = "Войти";
            button.setAttribute("href", "login.html");
            return;
        }

        const displayName = `${String(currentUser.firstName || "").trim()} ${String(currentUser.lastName || "").trim()}`.trim()
            || String(currentUser.email || "").trim()
            || "Профиль";

        button.textContent = displayName;
        button.setAttribute("href", auth.getHomePageForUser(currentUser));
        button.classList.add("login-button--profile");
        button.setAttribute("title", `Профиль: ${displayName}`);
    });

    document.querySelectorAll("[data-auth-logout]").forEach((button) => {
        if (isLoggedIn) {
            button.classList.add("is-visible");
        }

        button.addEventListener("click", () => {
            auth.logout();
            window.location.href = "login.html";
        });
    });
});
