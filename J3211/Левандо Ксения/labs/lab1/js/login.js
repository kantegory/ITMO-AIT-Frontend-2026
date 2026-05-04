document.addEventListener("DOMContentLoaded", () => {
    // if auth as organizer - cannot auth as user 
    if (localStorage.getItem("organizerAuth") === "true") {
        alert("You are already logged in as an organizer. Please logout first.");
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
            alert("User not found");
            return;
        }
        const foundUser = users[0];
        if (foundUser.password !== password) {
            alert("Wrong password");
            return;
        }
        // save session
        localStorage.setItem("user", JSON.stringify(foundUser));
        localStorage.setItem("auth", "true");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed");
    }
});
});