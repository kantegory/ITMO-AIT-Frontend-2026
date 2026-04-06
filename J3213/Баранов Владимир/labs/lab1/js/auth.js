function requireAuth() {
    const token = apiGetAccessToken();
    if (!token) {
        window.location.href = "login.html";
        return false;
    }
    return true;
}

function setupNavbarAuth() {
    const link = document.getElementById("navAuthLink");
    if (!link) {
        return;
    }

    const token = apiGetAccessToken();

    if (token) {
        link.textContent = "Выйти";
        link.href = "#";
        link.addEventListener("click", function (e) {
            e.preventDefault();
            apiClearSession();
            window.location.href = "login.html";
        });
    } else {
        link.textContent = "Вход";
        link.href = "login.html";
    }
}

function registerUser(username, email, password) {
    return apiClient().post("/register", {
        email: email,
        password: password,
        username: username
    });
}

function loginUser(email, password) {
    return apiClient().post("/login", {
        email: email,
        password: password
    });
}