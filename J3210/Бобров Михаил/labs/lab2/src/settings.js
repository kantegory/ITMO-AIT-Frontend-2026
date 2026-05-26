import { request } from "./api.js";

export function setupSettings() {
    const nameInput = document.getElementById("userNameInput");
    if (!nameInput) return;

    const emailInput = document.getElementById("userEmailInput");
    nameInput.value = localStorage.getItem("userName") || "";
    emailInput.value = localStorage.getItem("userEmail") || "";

    const avatar = localStorage.getItem("userAvatarBase64");
    if (avatar) document.getElementById("userAvatar").src = avatar;

    document.getElementById("saveSettingsBtn").onclick = async event => {
        const btn = event.currentTarget;
        const name = nameInput.value;
        const email = emailInput.value;
        await request(`/users/${localStorage.getItem("user")}`, {
            method: "PATCH",
            body: { name, email }
        });
        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);
        btn.innerText = "Сохранено!";
        setTimeout(() => btn.innerText = "Сохранить", 1500);
    };

    document.getElementById("avatarInput").onchange = event => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            localStorage.setItem("userAvatarBase64", reader.result);
            document.getElementById("userAvatar").src = reader.result;
        };
        reader.readAsDataURL(file);
    };
}
