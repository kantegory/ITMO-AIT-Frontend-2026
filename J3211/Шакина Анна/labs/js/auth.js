document.addEventListener("DOMContentLoaded", () => {
    const auth = window.SchoolAuth;
    const api = window.SchoolApi;
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const loginMessage = document.getElementById("loginMessage");
    const signupMessage = document.getElementById("signupMessage");
    const isExternalStudent = document.getElementById("isExternalStudent");
    const schoolFields = document.getElementById("schoolFields");
    const studentClassInput = document.getElementById("studentClass");
    const studentLetterInput = document.getElementById("studentLetter");

    if (
        !auth ||
        !api ||
        !loginForm ||
        !signupForm ||
        !loginMessage ||
        !signupMessage ||
        !isExternalStudent ||
        !schoolFields ||
        !studentClassInput ||
        !studentLetterInput
    ) {
        return;
    }

    toggleSchoolFields();

    document.querySelectorAll(".needs-validation").forEach((form) => {
        form.addEventListener("submit", (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add("was-validated");
        });
    });

    isExternalStudent.addEventListener("change", () => {
        toggleSchoolFields();
        signupForm.classList.remove("was-validated");
        hideMessage(signupMessage);
    });

    studentLetterInput.addEventListener("input", () => {
        studentLetterInput.value = String(studentLetterInput.value || "").trim().toUpperCase().slice(0, 1);
        studentLetterInput.setCustomValidity("");
    });

    studentClassInput.addEventListener("input", () => {
        studentClassInput.setCustomValidity("");
    });

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!loginForm.checkValidity()) {
            showMessage(loginMessage, "Проверьте почту и пароль.", false);
            return;
        }

        const email = String(document.getElementById("loginEmail")?.value || "").trim().toLowerCase();
        const password = String(document.getElementById("loginPass")?.value || "");

        try {
            const response = await api.login(email, password);
            if (response?.accessToken) {
                localStorage.setItem("accessToken", response.accessToken);
            }

            const currentUser = auth.setCurrentUser(response?.user);
            showMessage(loginMessage, "Вы вошли в аккаунт.", true);
            auth.redirectToUserHome(currentUser);
        } catch {
            showMessage(loginMessage, "Неверная почта или пароль.", false);
        }
    });

    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!signupForm.checkValidity()) {
            showMessage(signupMessage, "Заполните все обязательные поля корректно.", false);
            return;
        }

        const firstName = String(document.getElementById("firstName")?.value || "").trim();
        const lastName = String(document.getElementById("lastName")?.value || "").trim();
        const email = String(document.getElementById("signupEmail")?.value || "").trim().toLowerCase();
        const password = String(document.getElementById("signupPass")?.value || "");
        const isExternal = isExternalStudent.checked;
        const studentClass = studentClassInput.value.trim();
        const studentLetter = studentLetterInput.value.trim().toUpperCase();

        if (!isExternal) {
            const classNumber = Number(studentClass);

            if (!Number.isInteger(classNumber) || classNumber < 1 || classNumber > 11) {
                studentClassInput.setCustomValidity("Укажите класс от 1 до 11.");
                signupForm.classList.add("was-validated");
                showMessage(signupMessage, "Класс должен быть числом от 1 до 11.", false);
                return;
            }

            if (!/^[А-ЯЁ]$/.test(studentLetter)) {
                studentLetterInput.setCustomValidity("Укажите одну русскую заглавную букву.");
                signupForm.classList.add("was-validated");
                showMessage(signupMessage, "Буква класса должна быть одной русской заглавной буквой.", false);
                return;
            }
        }

        try {
            const response = await api.register(
                auth.normalizeUser({
                    firstName,
                    lastName,
                    email,
                    password,
                    role: "student",
                    isExternal,
                    studentClass: isExternal ? null : Number(studentClass),
                    studentLetter: isExternal ? null : studentLetter,
                    passwordText: password
                })
            );

            if (response?.accessToken) {
                localStorage.setItem("accessToken", response.accessToken);
            }

            const currentUser = auth.setCurrentUser(response?.user);
            showMessage(signupMessage, "Регистрация завершена.", true);
            auth.redirectToUserHome(currentUser);
        } catch {
            showMessage(signupMessage, "Не удалось зарегистрироваться. Возможно, такая почта уже занята.", false);
        }
    });

    function toggleSchoolFields() {
        const shouldHideSchoolFields = isExternalStudent.checked;

        schoolFields.classList.toggle("d-none", shouldHideSchoolFields);
        studentClassInput.disabled = shouldHideSchoolFields;
        studentLetterInput.disabled = shouldHideSchoolFields;
        studentClassInput.required = !shouldHideSchoolFields;
        studentLetterInput.required = !shouldHideSchoolFields;
        studentClassInput.setCustomValidity("");
        studentLetterInput.setCustomValidity("");

        if (shouldHideSchoolFields) {
            studentClassInput.value = "";
            studentLetterInput.value = "";
        }
    }

    function showMessage(el, text, isSuccess) {
        el.textContent = text;
        el.classList.remove("d-none", "auth-form-msg--error", "auth-form-msg--success");
        el.classList.add(isSuccess ? "auth-form-msg--success" : "auth-form-msg--error");
    }

    function hideMessage(el) {
        el.textContent = "";
        el.classList.add("d-none");
        el.classList.remove("auth-form-msg--error", "auth-form-msg--success");
    }
});
