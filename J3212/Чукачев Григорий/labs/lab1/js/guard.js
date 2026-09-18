document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const userName = localStorage.getItem("userName");

    const userNameDisplay = document.getElementById("userNameDisplay");

    if (userNameDisplay && userName) {
        userNameDisplay.textContent = `Привет, ${userName}!`;
    }

    const logoutBtn = document.querySelector('a[href="login.html"]');

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userName");
            window.location.href = "login.html";
        });
    }
});