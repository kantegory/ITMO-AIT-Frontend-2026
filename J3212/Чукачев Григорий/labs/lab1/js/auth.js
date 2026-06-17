document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {

        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("emailInput").value;
            const password = document.getElementById("passwordInput").value;
            const confirmPassword = document.getElementById("passwordConfirm").value;
            const name = document.getElementById("nameInput").value;

            if (password !== confirmPassword) {
                alert("Пароли не совпадают!");
                return;
            }

            const userData = {
                email: email,
                password: password,
                name: name
            };

            try {
                const response = await fetch("http://localhost:3000/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userData)
                });

                if (response.ok) {
                    alert("Регистрация прошла успешно!");
                    window.location.href = "login.html";
                } else {
                    const errorData = await response.json();
                    alert("Ошибка: " + errorData);
                }
            } catch (error) {
                alert("Ошибка соединения с сервером.");
                console.error(error);
            }
        });
    }
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("emailInput").value;
            const password = document.getElementById("passwordInput").value;

            try {
                const response = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email: email, password: password })
                });

                if (response.ok) {
                    const data = await response.json();

                    localStorage.setItem("accessToken", data.accessToken);
                    localStorage.setItem("userName", data.user.name);

                    alert("Успешный вход!");
                    window.location.href = "dashboard.html";
                }
                else {
                    alert("Неверный email или пароль!");
                }
            } catch (error) {
                console.error("Ошибка:", error);
                alert("Ошибка соединения с сервером.");
            }
        });
    }
});