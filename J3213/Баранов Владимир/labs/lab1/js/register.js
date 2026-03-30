document.addEventListener("DOMContentLoaded", function () {
    setupNavbarAuth();

    const form = document.getElementById("registerForm");
    const errorBox = document.getElementById("registerError");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (errorBox) {
            errorBox.textContent = "";
            errorBox.classList.add("d-none");
        }

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            if (errorBox) {
                errorBox.textContent = "Пароли не совпадают";
                errorBox.classList.remove("d-none");
            }
            return;
        }

        registerUser(username, email, password)
            .then(function (res) {
                const data = res.data;
                if (data && data.accessToken && data.user) {
                    apiSetSession(data.accessToken, data.user);
                }
                window.location.href = "dashboard.html";
            })
            .catch(function () {
                if (errorBox) {
                    errorBox.textContent = "Ошибка регистрации. Возможно, API недоступен.";
                    errorBox.classList.remove("d-none");
                }
            });
    });
});