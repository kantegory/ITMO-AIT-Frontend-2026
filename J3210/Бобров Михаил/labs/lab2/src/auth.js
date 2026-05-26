import { request } from "./api.js";

export function isAuthPage() {
    return window.location.pathname.includes("login.html") || window.location.pathname.includes("register.html");
}

export function requireAuth() {
    if (!localStorage.getItem("user") && !isAuthPage()) {
        window.location.href = "login.html";
        return false;
    }
    return true;
}

export function setupAuthForms() {
    const loginForm = document.querySelector("title")?.innerText.includes("Вход") ? document.querySelector("form") : null;
    const registerForm = document.querySelector("title")?.innerText.includes("Регистрация") ? document.querySelector("form") : null;

    if (loginForm) {
        loginForm.onsubmit = async event => {
            event.preventDefault();
            const email = loginForm.querySelector('input[type="email"]')?.value.trim();
            const password = loginForm.querySelector('input[type="password"]')?.value;

            try {
                const users = await request(`/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
                const user = users[0];
                if (!user) {
                    alert("Неверный email или пароль");
                    return;
                }
                saveSession(user);
                window.location.href = "dashboard.html";
            } catch (error) {
                alert("Не удалось подключиться к API");
            }
        };
    }

    if (registerForm) {
        registerForm.onsubmit = async event => {
            event.preventDefault();
            const inputs = registerForm.querySelectorAll("input");
            const name = inputs[0]?.value.trim() || "";
            const email = registerForm.querySelector('input[type="email"]')?.value.trim() || "";
            const passwords = registerForm.querySelectorAll('input[type="password"]');

            if (passwords[0]?.value !== passwords[1]?.value) {
                alert("Пароли не совпадают");
                return;
            }

            try {
                const existingUsers = await request(`/users?email=${encodeURIComponent(email)}`);
                if (existingUsers.length) {
                    alert("Пользователь с таким email уже существует");
                    return;
                }
                const user = await request("/users", {
                    method: "POST",
                    body: { name, email, password: passwords[0]?.value }
                });
                saveSession(user);
                window.location.href = "dashboard.html";
            } catch (error) {
                alert("Не удалось подключиться к API");
            }
        };
    }
}

export function setupLogout() {
    const btn = document.getElementById("logoutBtn");
    if (btn) btn.onclick = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        window.location.href = "login.html";
    };
}

function saveSession(user) {
    localStorage.setItem("user", String(user.id));
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userEmail", user.email);
}
