(function () {
    const key = "theme";
    const darkMedia = "(prefers-color-scheme: dark)";
    const darkLink = document.querySelector('link[href$="css/dark.css"]');
    const systemDark = window.matchMedia(darkMedia);
    const isValidTheme = (value) => value === "light" || value === "dark" || value === "auto";

    if (!darkLink) return;

    let theme = localStorage.getItem(key);
    if (!isValidTheme(theme)) theme = "auto";

    const applyTheme = (value) => {
        if (value === "dark") {
            darkLink.media = "all";
            document.documentElement.style.colorScheme = "dark";
            return;
        }

        if (value === "light") {
            darkLink.media = "not all";
            document.documentElement.style.colorScheme = "light";
            return;
        }

        darkLink.media = darkMedia;
        document.documentElement.style.colorScheme = "";
    };

    const setActiveItem = (value) => {
        document.querySelectorAll("[data-theme-option]").forEach((item) => {
            item.classList.toggle("active", item.dataset.themeOption === value);
        });
    };

    applyTheme(theme);

    document.addEventListener("DOMContentLoaded", () => {
        setActiveItem(theme);

        document.addEventListener("click", (event) => {
            const item = event.target.closest("[data-theme-option]");
            if (!item) return;

            if (!isValidTheme(item.dataset.themeOption)) return;
            theme = item.dataset.themeOption;
            localStorage.setItem(key, theme);
            applyTheme(theme);
            setActiveItem(theme);
        });
    });

    systemDark.addEventListener("change", () => {
        if (theme === "auto") {
            applyTheme("auto");
        }
    });
})();
