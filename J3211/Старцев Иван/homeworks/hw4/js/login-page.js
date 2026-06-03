import api from "./api.js";
import auth from "./auth.js";

(() => {
    const form = document.getElementById("loginForm");
    const alert = document.getElementById("loginAlert");
    const passwordInput = document.getElementById("InputPassword");

    const showMessage = (type, text) => {
        alert.className = `alert alert-${type}`;
        alert.textContent = text;
        alert.classList.remove("d-none");
    };

    const hideMessage = () => {
        alert.className = "alert d-none";
        alert.textContent = "";
    };

    passwordInput.addEventListener("input", () => {
        passwordInput.value = passwordInput.value.replace(/\s/g, "");
    });

    const init = async () => {
        if (await auth.redirectAuth()) {
            return;
        }

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            hideMessage();

            const formData = new FormData(form);

            try {
                const response = await api.login({
                    email: formData.get("email").trim(),
                    password: formData.get("password")
                });

                auth.setSession(response.user);
                window.location.replace("courses.html");
            } catch {
                showMessage("danger", "Не удалось войти.");
            }
        });
    };

    init();
})();
