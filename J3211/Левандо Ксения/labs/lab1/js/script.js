document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
});

function updateNavbar() {
    const auth = localStorage.getItem("auth") === "true";
    const organizerAuth = localStorage.getItem("organizerAuth") === "true";
    const block = document.getElementById("authButtons");

    if (!block) return;

    // if authorized as a user
    if (auth) {
        const user = JSON.parse(localStorage.getItem("user"));
        block.innerHTML = `
            <span class="text-light mt-2 me-3">
                Hello, ${user.name}!
            </span>
            <a href="dashboard.html" class="btn btn-outline-light me-3">
                My Profile
            </a>
            <button class="btn btn-outline-warning" onclick="logoutUser()">Logout</button>
        `;
        return;
    }

    // if authorized as an organizer
    if (organizerAuth) {
        const email = localStorage.getItem("organizerEmail");
        block.innerHTML = `
            <span class="text-light mt-2 me-3">
                Organizer: ${email}
            </span>
            <a href="organizer-dashboard.html" class="btn btn-outline-light me-3">
                Dashboard
            </a>
            <button class="btn btn-outline-warning" onclick="logoutOrganizer()">Logout</button>
        `;
        return;
    }

    // if not authorized at all
    block.innerHTML = `
        <a href="login.html" class="btn btn-outline-light me-3">Login</a>
        <a href="register.html" class="btn btn-warning">Register</a>
    `;
}

// Logout user
function logoutUser() {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    location.reload();
}

// Logout organizer
function logoutOrganizer() {
    localStorage.removeItem("organizerAuth");
    localStorage.removeItem("organizerEmail");
    location.reload();
    window.location.href = "login.html";
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const activeIcon = document.getElementById("themeIconAlt");
    const text = document.getElementById("themeTextAlt");
    
    if (currentTheme === "dark") {
        // switch to light theme
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        if (activeIcon) activeIcon.textContent = "☀️";
        if (text) text.textContent = "Light mode";
    } else {
        // switch to dark theme
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        if (activeIcon) activeIcon.textContent = "🌙";
        if (text) text.textContent = "Dark mode";
    }
}

// loading the saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const activeIcon = document.getElementById("themeIconAlt");
    const text = document.getElementById("themeTextAlt");
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute("data-theme", "dark");
        if (activeIcon) activeIcon.textContent = "🌙";
        if (text) text.textContent = "Dark mode";
    } else {
        document.documentElement.removeAttribute("data-theme");
        if (activeIcon) activeIcon.textContent = "☀️";
        if (text) text.textContent = "Light mode";
    }
});