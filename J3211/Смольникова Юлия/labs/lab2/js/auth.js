document.addEventListener("DOMContentLoaded", () => {
    initLoginForm();
    initRegisterForm();
});

function initLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    const errorBox = form.querySelector("#formError");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = form.querySelector('[name="email"]').value.trim().toLowerCase();
        const password = form.querySelector('[name="password"]').value.trim();

        hideMessage(errorBox);

        if (!email || !password) {
            showMessage(errorBox, "Введите email и пароль");
            return;
        }

        try {
            const data = await loginUser({ email, password });

            if (data.accessToken) saveToken(data.accessToken);
            if (data.user) {
                const { password: _, ...safeUserData } = data.user;
                saveUser(safeUserData);
            }

            window.location.href = "dashboard.html";
        } catch (err) {
            showMessage(errorBox, err.message || "Неверный email или пароль");
        }
    });
}

function initRegisterForm() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    const errorBox = form.querySelector("#formError");
    const successBox = form.querySelector("#formSuccess");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = form.querySelector('[name="name"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim().toLowerCase();
        const password = form.querySelector('[name="password"]').value.trim();

        hideMessage(errorBox);
        hideMessage(successBox);

        if (!name || !email || !password) {
            showMessage(errorBox, "Заполните все поля");
            return;
        }

        try {
            const data = await registerUser({
                name,
                email,
                password,
                role: "student"
            });

            if (data.accessToken) saveToken(data.accessToken);
            if (data.user) {
                const { password: _, ...safeUserData } = data.user;
                saveUser(safeUserData);
            }

            showMessage(successBox, "Регистрация успешна! Перенаправляем в личный кабинет...");
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        } catch (err) {
            showMessage(errorBox, err.message || "Ошибка регистрации");
        }
    });
}

function showMessage(container, message) {
    if (!container) return;
    container.textContent = message;
    container.style.display = "block";
}

function hideMessage(container) {
    if (!container) return;
    container.textContent = "";
    container.style.display = "none";
}

window.logout = function () {
    localStorage.removeItem("learnify_token");
    localStorage.removeItem("learnify_user");
    window.location.href = "index.html";
};
