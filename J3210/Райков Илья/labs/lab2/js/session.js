export function initSession() {
    const navAuthButtons = document.getElementById("navAuthButtons");
    
    const token = localStorage.getItem('accessToken');
    const isLoggedIn = !!token;

    if (isLoggedIn && navAuthButtons) {
        const user = JSON.parse(localStorage.getItem('user'));
        
        navAuthButtons.innerHTML = `
            <span class="text-light me-auto d-none d-md-inline" aria-live="polite">
                Привет, <strong class="text-warning">${user.firstName}</strong>!
            </span>
            <a href="#" class="btn btn-outline-danger btn-sm ms-2" id="globalLogoutBtn" aria-label="Выйти из учетной записи">
                <svg class="icon" aria-hidden="true"><use href="img/sprite.svg#box-arrow-right"></use></svg> Выйти
            </a>
        `;

        const globalLogoutBtn = document.getElementById("globalLogoutBtn");
        if (globalLogoutBtn) {
            globalLogoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                if (confirm("Выйти из аккаунта?")) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('user');
                    window.location.href = "index.html"; 
                }
            });
        }
    }

    const navMyLearning = document.getElementById("navMyLearning");
    if (navMyLearning) {
        navMyLearning.addEventListener("click", function(event) {
            if (!isLoggedIn) {
                event.preventDefault();
                alert("Чтобы увидеть свои курсы, пожалуйста, войдите в систему.");
                window.location.href = "login.html";
            }
        });
    }
}

export function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

export function getAuthToken() {
    return localStorage.getItem('accessToken');
}