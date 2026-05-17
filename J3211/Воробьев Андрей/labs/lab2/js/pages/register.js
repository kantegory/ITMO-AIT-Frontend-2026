import {showModal} from "../core/modal.js";
import {registerUser} from "../core/api.js";

async function register(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const registerData = {};

    formData.forEach((value, label) => {
        registerData[label] = value
    });

    if (registerData.password.length < 6) {
        showModal("Ошибка", "Пароль должен содержать минимум 6 символов.");
        return;
    }

    if (registerData.password !== registerData.confirmPassword) {
        showModal("Ошибка", "Пароли не совпадают.");
        return;
    }

    try {
        await registerUser(registerData.email, registerData.password);

        showModal("Регистрация успешна", `Аккаунт ${registerData.email} создан.`);

        setTimeout(() => {
            window.location.href = "index.html";
        }, 900);
    } catch (error) {
        showModal("Ошибка", error.message);
    }
}

window.register = register;
