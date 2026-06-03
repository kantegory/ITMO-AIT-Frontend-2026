import {showModal} from "../core/modal.js";
import {createAccount} from "../core/api.js";
import {getCurrentUser} from "../core/auth.js";

async function submitManualAccount(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const accountData = {};

    formData.forEach((value, label) => {
        accountData[label] = value
    });

    const user = getCurrentUser();

    try {
        await createAccount({
            userId: user.id, accountName: accountData.accountName, type: "manual"
        });
        showModal("Уведомление", `Счёт ${accountData.accountName} создан.`);
        setTimeout(() => {
            location.reload();
        }, 700);
    } catch (error) {
        showModal("Ошибка", error.message);
    }
}

async function submitApiAccount(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const accountData = {};

    formData.forEach((value, label) => {
        accountData[label] = value;
    });

    const user = getCurrentUser();

    try {
        await createAccount({
            userId: user.id,
            accountName: accountData.accountName,
            type: "api"
        });
        showModal("Уведомление", `Счёт ${accountData.accountName} подключен по API.`);
        setTimeout(() => {
            location.reload();
        }, 700);
    } catch (error) {
        showModal("Ошибка", error.message);
    }
}

window.submitManualAccount = submitManualAccount;
window.submitApiAccount = submitApiAccount;
