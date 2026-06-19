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
        if (await window.auth.redirectAuth()) {
            return;
        }

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            hideMessage();

            const formData = new FormData(form);
            const email = formData.get("email").trim();

            try {
                const response = await window.api.signup({
                    name: formData.get("name").trim(),
                    email,
                    password: formData.get("password"),
                    avatar: `https://i.pravatar.cc/300?u=${encodeURIComponent(email)}`,
                    learningCourseIds: [],
                    createdCourseIds: []
                });

                window.auth.setSession(response.user);
                window.location.replace("courses.html");
            } catch {
                showMessage("danger", "Не удалось зарегистрироваться.");
            }
        });
    };

    init();
})();
