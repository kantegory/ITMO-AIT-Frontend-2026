const PROTECTED_PAGES = ["account.html", "search.html", "dashboard.html", "add_bank_account.html"];
const GUEST_PAGES = ["index.html", "register.html", "forgot_password.html"];

function currentPageName() {
    return window.location.pathname.split("/").pop() || "index.html";
}

export function getCurrentUser() {
    return JSON.parse(localStorage.user);
}

export function isAuthenticated() {
    return Boolean(localStorage.accessToken);
}

export function setSession(user) {
    localStorage.accessToken = `mock_token_${Date.now()}`;
    localStorage.user = JSON.stringify(user);
}

export function clearSession() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
}

export function guardRoute() {
    const page = currentPageName();
    const auth = isAuthenticated();

    if (PROTECTED_PAGES.includes(page) && !auth) {
        window.location.href = "index.html";
        return false;
    }

    if (GUEST_PAGES.includes(page) && auth) {
        window.location.href = "account.html";
        return false;
    }

    return true;
}

export function bindLogout(container = document) {
    const logoutButton = container.querySelector("#logoutButton");
    if (!logoutButton) return;

    logoutButton.addEventListener("click", (event) => {
        event.preventDefault();
        clearSession();
        window.location.href = "index.html";
    });
}


