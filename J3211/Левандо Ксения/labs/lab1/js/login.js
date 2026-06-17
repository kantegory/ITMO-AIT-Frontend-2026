document.addEventListener("DOMContentLoaded", () => {
    // if auth as organizer - cannot auth as user 
    if (localStorage.getItem("organizerAuth") === "true") {
        showModal("Error", "You are already logged in as an organizer. Please logout first.","error");
        window.location.href = "organizer-dashboard.html";
        return;
    }

    // if auth as user - redirect to dasboard
    if (localStorage.getItem("auth") === "true") {
        window.location.href = "dashboard.html";
        return;
    }

document.getElementById("loginForm").addEventListener("submit", async function(e){
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    try{
        // check user in API
        const response = await fetch(
            `http://localhost:3000/users?email=${email}`
        );
        const users = await response.json();
        if (users.length === 0) {
            showModal("Error", "User not found","error");
            return;
        }
        const foundUser = users[0];
        if (foundUser.password !== password) {
            showModal("Error", "Wrong password","error");
            return;
        }
        // save session
        localStorage.setItem("user", JSON.stringify(foundUser));
        localStorage.setItem("auth", "true");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Login error:", error);
        showModal("Error", "Login failed","error");
    }
});
});

// function for modal
function showModal(title, message, type = "primary") {
    const modalEl = document.getElementById("appModal");

    document.getElementById("appModalTitle").textContent = title;
    document.getElementById("appModalBody").textContent = message;

    const header = modalEl.querySelector(".modal-header");

    // reset classes
    header.className = "modal-header";

    // add color
    if (type === "error") header.classList.add("bg-danger", "text-white");
    if (type === "success") header.classList.add("bg-success", "text-white");
    if (type === "warning") header.classList.add("bg-warning");
    if (type === "info") header.classList.add("bg-info", "text-white");

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}