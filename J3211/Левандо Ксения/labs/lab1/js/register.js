const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const repeatPassword = document.getElementById("repeatPassword").value;
    const terms = document.getElementById("terms").checked;

    // Checks
    if (!name || !email || !password || !repeatPassword) {
        showModal("Warning", "Please fill all fields","warning");
        return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        showModal("Warning", "Enter a valid email","warning");
        return;
    }

    // Password length validation
    if (password.length < 8) {
      showModal("Error", "Password cannot be shorted than 8 characters","error");
      return;
    }

    // Passwords matching
    if (password !== repeatPassword) {
        showModal("Error", "Passwords do not match","error");
        return;
    }

    // Terms
    if (!terms) {
        showModal("Error", "You must accept the terms","error");
        return;
    }

    try{
        // check if already exists
        const checkResponse = await fetch(`http://localhost:3000/users?email=${email}`);
        const existingUsers = await checkResponse.json();

        if (existingUsers.length > 0) {
            showModal("Error", "User with this email already exists","error");
            return;
        }
        // create user
        const newUser = {
            name,
            email,
            password
        };

        await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        });
    showModal("Success", "Registration successful!","success");

    // Switch to login page
    window.location.href = "login.html";

    } catch (error) {
        console.error("Registration error:", error);
        showModal("Error", "Registration failed","error");
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