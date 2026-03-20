import { API_URL } from "../core/api.js";
import { initSharedPage } from "../core/layout.js";
import { storage } from "../core/storage.js";

document.addEventListener("DOMContentLoaded", async () => {
    await initSharedPage();

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;

            try {
                const res = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
                const users = await res.json();

                if (users.length > 0) {
                    const user = users[0];
                    storage.setIsLoggedIn(true);
                    storage.setUserId(user.id);
                    storage.setUserName(user.username);
                    storage.setUserEmail(user.email);
                    window.location.href = "profile.html";
                    return;
                }

                alert("Invalid email or password!");
            } catch (err) {
                console.error(err);
            }
        });
    }

    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("register-username").value.trim();
            const email = registerForm.querySelector('input[type="email"]').value;
            const password = registerForm.querySelector('input[type="password"]').value;

            try {
                const check = await fetch(`${API_URL}/users?email=${email}`);
                if ((await check.json()).length > 0) {
                    alert("Email already in use!");
                    return;
                }

                const newUser = { id: String(Date.now()), username, email, password };
                await fetch(`${API_URL}/users`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newUser)
                });

                storage.setIsLoggedIn(true);
                storage.setUserId(newUser.id);
                storage.setUserName(username);
                storage.setUserEmail(email);
                window.location.href = "profile.html";
            } catch (err) {
                console.error(err);
            }
        });
    }
});
