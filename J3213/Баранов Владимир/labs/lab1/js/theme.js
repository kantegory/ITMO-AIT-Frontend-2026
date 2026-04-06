(function () {
    const STORAGE_KEY = "pipelinelab-theme";

    function preferredTheme() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored === "lab" || stored === "pipeline") {
                return stored;
            }
        } catch (_) {}
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "pipeline";
        }
        return "lab";
    }

    function applyTheme(id) {
        const theme = id === "pipeline" ? "pipeline" : "lab";
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.setAttribute(
            "data-bs-theme",
            theme === "pipeline" ? "dark" : "light"
        );
    }

    function syncToggleButton() {
        const theme =
            document.documentElement.getAttribute("data-theme") === "pipeline"
                ? "pipeline"
                : "lab";
        const btn = document.getElementById("themeToggle");
        if (!btn) {
            return;
        }
        const isPipeline = theme === "pipeline";
        btn.setAttribute("aria-pressed", isPipeline ? "true" : "false");
        btn.setAttribute(
            "aria-label",
            isPipeline
                ? "Включить светлую тему Lab"
                : "Включить тёмную тему Pipeline"
        );
        btn.title = isPipeline
            ? "Сейчас тема Pipeline — переключить на Lab"
            : "Сейчас тема Lab — переключить на Pipeline";
        const toLab = btn.querySelector("[data-show-when='pipeline']");
        const toPipe = btn.querySelector("[data-show-when='lab']");
        if (toLab) {
            toLab.classList.toggle("d-none", !isPipeline);
        }
        if (toPipe) {
            toPipe.classList.toggle("d-none", isPipeline);
        }
    }

    applyTheme(preferredTheme());

    document.addEventListener("DOMContentLoaded", function () {
        syncToggleButton();
        const btn = document.getElementById("themeToggle");
        if (btn) {
            btn.addEventListener("click", function () {
                const cur =
                    document.documentElement.getAttribute("data-theme") === "pipeline"
                        ? "pipeline"
                        : "lab";
                const next = cur === "lab" ? "pipeline" : "lab";
                try {
                    localStorage.setItem(STORAGE_KEY, next);
                } catch (_) {}
                applyTheme(next);
                syncToggleButton();
            });
        }
    });
})();
