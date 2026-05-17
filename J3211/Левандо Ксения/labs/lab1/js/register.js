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
        alert("Please fill all fields");
        return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Enter a valid email");
        return;
    }

    // Password length validation
    if (password.length < 8) {
      alert("Password cannot be shorted than 8 characters");
      return;
    }

    // Passwords matching
    if (password !== repeatPassword) {
        alert("Passwords do not match");
        return;
    }

    // Terms
    if (!terms) {
        alert("You must accept the terms");
        return;
    }

    try{
        // check if already exists
        const checkResponse = await fetch(`http://localhost:3000/users?email=${email}`);
        const existingUsers = await checkResponse.json();

        if (existingUsers.length > 0) {
            alert("User with this email already exists");
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
    alert("Registration successful!");

    // Switch to login page
    window.location.href = "login.html";

    } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed");
    }
});