document.addEventListener("DOMContentLoaded", () => {
    const organizers = JSON.parse(localStorage.getItem("organizers")) || [];

    // if a user is authorized - block 
    if (localStorage.getItem("auth") === "true") {
        showModal("Error", "You are already logged in as a user. Please logout first.","error");
        window.location.href = "dashboard.html";
        return;
    }

    //if already authorized - redirect
    if (localStorage.getItem("organizerAuth") === "true") {
        window.location.href = "organizer-dashboard.html";
        return;
    }

    // --- register ---
    const regForm = document.getElementById("orgRegisterForm");
    if (regForm) {
        regForm.onsubmit = async function(e) {
            e.preventDefault();
            const name = document.getElementById("orgRegName").value.trim();
            const email = document.getElementById("orgRegEmail").value.trim().toLowerCase();
            const password = document.getElementById("orgRegPassword").value;
            try {
                // check if organizer exists
                const check = await fetch(`http://localhost:3000/organizers?email=${email}`);
                const existing = await check.json();

                if (existing.length > 0) {
                    showModal("Error", "Organizer with this email already exists","error");
                    return;
                }

                const newOrganizer = {
                    name,
                    email,
                    password
                };

                await fetch("http://localhost:3000/organizers", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newOrganizer)
                });
        
            showModal("Success", "Organizer registered successfully! You can login now.","success");
            regForm.reset();
            } catch (error){
                console.error("Registration error:", error);
                showModal("Error", "Registration failed","error");
            }
        };
    }

    // --- log in ---
    const loginForm = document.getElementById("orgLoginForm");
    if (loginForm) {
        loginForm.onsubmit = async function(e) {
            e.preventDefault();
            const email = document.getElementById("orgLoginEmail").value.trim().toLowerCase();
            const password = document.getElementById("orgLoginPassword").value;

            try {
                const response = await fetch(`http://localhost:3000/organizers?email=${email}`);
                const organizers = await response.json();
                if (organizers.length === 0) {
                    showModal("Error", "Organizer not found","error");
                    return;
                }
                const org = organizers[0];
                if (org.password !== password) {
                    showModal("Error", "Wrong password","error");
                    return;
                }
                // save organizer logged-in
                localStorage.setItem("organizerAuth", "true");
                localStorage.setItem("organizerEmail", email);

                // redirect to organizer dashboard
                window.location.href = "organizer-dashboard.html";
            }
            catch (error) {

                console.error("Login error:", error);
                showModal("Error", "Login failed","error");

            }
        };
    }
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