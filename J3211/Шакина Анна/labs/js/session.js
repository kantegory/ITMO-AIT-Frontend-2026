document.addEventListener("DOMContentLoaded", () => {
    const auth = window.SchoolAuth;
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
