(() => {
    const cookieName = "theme";

    const getSavedTheme = () => {
        const match = document.cookie.match(/theme=(light|dark)/);
        if (!match) {return null;}
        return match[1]
    };

    const getSystemTheme = () =>
        window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    const applyTheme = (theme) => {
        document.documentElement.setAttribute("data-bs-theme", theme);
        document.cookie = `${cookieName}=${theme}; path=/;`;
    };

    applyTheme(getSavedTheme() || getSystemTheme());

    window.theme = {
        toggle: () => applyTheme(getSavedTheme() === "dark" ? "light" : "dark")
    };
})();
