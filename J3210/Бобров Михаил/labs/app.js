document.addEventListener("DOMContentLoaded", () => {

    console.log("DataPort app loaded");

    setupUploadModal();
    fakeAuthCheck();

});

function setupUploadModal() {
    const uploadBtn = document.querySelector(".btn-primary");

    if (!uploadBtn) return;

    uploadBtn.addEventListener("click", () => {
        alert("Тут будет загрузка модели или датасета 🙂");
    });
}

function fakeAuthCheck() {
    const isLoggedIn = localStorage.getItem("user");

    if (!isLoggedIn && window.location.pathname.includes("dashboard")) {
        window.location.href = "login.html";
    }
}

const loginForm = document.querySelector('form');
if (loginForm && window.location.pathname.includes("login.html")) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        localStorage.setItem("user", "active");
        window.location.href = "dashboard.html";
    });
}