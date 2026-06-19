import api from "./api.js";
import auth from "./auth.js";

(() => {
    const form = document.getElementById("registerForm");
    const alert = document.getElementById("registerAlert");
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
            const email = formData.get("email").trim();

            try {
                const response = await api.signup({
                    name: formData.get("name").trim(),
                    email,
                    password: formData.get("password"),
                    avatar: `https://i.pravatar.cc/300?u=${encodeURIComponent(email)}`,
                    learningCourseIds: [],
                    createdCourseIds: []
                });

                auth.setSession(response.user);
                window.location.replace("courses.html");
            } catch {
                showMessage("danger", "Не удалось зарегистрироваться.");
            }
        });
    };

    init();
})();
