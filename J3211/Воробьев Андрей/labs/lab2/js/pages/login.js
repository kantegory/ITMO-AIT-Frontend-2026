import {showModal} from "../core/modal.js";
import {loginUser} from "../core/api.js";
import {setSession} from "../core/auth.js";

async function login(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const loginData = {};

    formData.forEach((value, label) => {
        loginData[label] = value
    });

    try {
        const user = await loginUser(loginData.email, loginData.password);

        setSession({
            id: user.id,
            email: user.email
        });

        showModal("Добро пожаловать", "Вы успешно вошли в систему.");

        setTimeout(() => {
            window.location.href = "account.html";
        }, 900);
    } catch (error) {
        showModal("Ошибка", error.message);
    }
}

window.login = login;
