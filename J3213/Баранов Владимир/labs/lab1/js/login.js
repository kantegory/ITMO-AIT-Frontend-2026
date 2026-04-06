document.addEventListener("DOMContentLoaded", function () {
    setupNavbarAuth();

    const form = document.getElementById("loginForm");
    const errorBox = document.getElementById("loginError");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (errorBox) {
            errorBox.textContent = "";
            errorBox.classList.add("d-none");
        }

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        loginUser(email, password)
            .then(function (res) {
                const data = res.data;
                if (!data || !data.accessToken || !data.user) {
                    throw new Error("Bad login response");
                }
                apiSetSession(data.accessToken, data.user);
                window.location.href = "dashboard.html";
            })
            .catch(function () {
                if (errorBox) {
                    errorBox.textContent = "Ошибка входа. Проверь API и данные.";
                    errorBox.classList.remove("d-none");
                }
            });
    });
});