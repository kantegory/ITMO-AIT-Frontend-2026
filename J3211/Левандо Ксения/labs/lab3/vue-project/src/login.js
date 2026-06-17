import axios from "../api/instance.js"; // путь к instance.js

// modal helper
function showModal(title, message, type = "info") {
    const modalEl = document.getElementById("appModal");
    const modal = new bootstrap.Modal(modalEl);
    document.getElementById("appModalTitle").textContent = title;
    document.getElementById("appModalBody").textContent = message;

    // цвет заголовка по типу
    const header = modalEl.querySelector(".modal-header");
    header.className = `modal-header ${type === "error" ? "bg-danger text-white" : type === "success" ? "bg-success text-white" : ""}`;

    modal.show();
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        showModal("Error", "Please fill in all fields", "error");
        return;
    }

    try {
        // запрос логина через axios
        const response = await axios.get("/users", {
            params: { email, password } // фильтрация на сервере
        });

        const users = response.data;

        if (users.length === 0) {
            showModal("Error", "Invalid email or password", "error");
            return;
        }

        // берём первого пользователя (уникальный email)
        const user = users[0];

        // сохраняем в localStorage
        localStorage.setItem("auth", "true");
        localStorage.setItem("user", JSON.stringify(user));

        showModal("Success", `Welcome, ${user.name}!`, "success");

        // редирект через 2 секунды
        setTimeout(() => {
            window.location.href = "/";
        }, 2000);

    } catch (error) {
        console.error("Login error:", error);
        showModal("Error", "Server error, try again later", "error");
    }
});