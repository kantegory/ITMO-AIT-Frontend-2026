document.addEventListener("DOMContentLoaded", () => {
    const organizers = JSON.parse(localStorage.getItem("organizers")) || [];

    // if a user is authorized - block 
    if (localStorage.getItem("auth") === "true") {
        alert("You are already logged in as a user. Please logout first.");
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
                    alert("Organizer with this email already exists");
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
        
            alert("Organizer registered successfully! You can login now.");
            regForm.reset();
            } catch (error){
                console.error("Registration error:", error);
                alert("Registration failed");
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
                    alert("Organizer not found");
                    return;
                }
                const org = organizers[0];
                if (org.password !== password) {
                    alert("Wrong password");
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
                alert("Login failed");

            }
        };
    }
});