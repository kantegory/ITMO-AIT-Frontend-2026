import {showModal} from "../core/modal.js";
import {findUserByEmail} from "../core/api.js";

async function forgotPassword(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const forgotData = {};

    formData.forEach((value, label) => {
        forgotData[label] = value
    });

    try {
        const user = await findUserByEmail(forgotData.email);

        if (!user) {
            showModal("Ошибка", "Аккаунт с таким email не найден.");
            return;
        }

        showModal("Письмо отправлено", "Инструкции по восстановлению пароля отправлены на email.");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 900);
    } catch (error) {
        showModal("Ошибка", error.message);
    }
}

window.forgotPassword = forgotPassword;
