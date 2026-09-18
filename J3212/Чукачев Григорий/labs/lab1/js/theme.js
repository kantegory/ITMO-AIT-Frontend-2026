document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("themeToggleBtn");

    const currentTheme = localStorage.getItem("theme") || "light";

    function applyTheme(theme) {
        document.body.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);

        if (toggleBtn) {
            if (theme === "zombie") {
                toggleBtn.innerHTML = '<svg width="26" height="26" class="me-2"><use href="img/sprite.svg#icon-pineapple"></use></svg> Вернуть норму';
            } else {
                toggleBtn.innerHTML = '<svg width="26" height="26" class="me-2"><use href="img/sprite.svg#icon-zombie"></use></svg> Зомби-мод';
            }
        }

        const logos = document.querySelectorAll('img[alt="Логотип Финанас"]');
        logos.forEach(logo => {
            logo.src = theme === "zombie" ? "img/zombie_logo.png" : "img/logo.png";
        });
    }

    applyTheme(currentTheme);

    if (toggleBtn) {
        toggleBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const current = document.body.getAttribute("data-theme");
            const newTheme = current === "zombie" ? "light" : "zombie";
            applyTheme(newTheme);
        });
    }
});