export function initSession() {
    const navAuthButtons = document.getElementById("navAuthButtons");
    
    const currentUserData = localStorage.getItem('edu_current_user');
    const isLoggedIn = currentUserData !== null;

    if (isLoggedIn && navAuthButtons) {
        const user = JSON.parse(currentUserData);
        
        navAuthButtons.innerHTML = `
            <span class="text-light me-auto d-none d-md-inline">
                Привет, <strong class="text-warning">${user.firstName}</strong>!
            </span>
            <a href="#" class="btn btn-outline-danger btn-sm ms-2" id="globalLogoutBtn"><i class="bi bi-box-arrow-right"></i> Выйти</a>
        `;

        const globalLogoutBtn = document.getElementById("globalLogoutBtn");
        if (globalLogoutBtn) {
            globalLogoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                if (confirm("Выйти из аккаунта?")) {
                    localStorage.removeItem('edu_current_user');
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
    const data = localStorage.getItem('edu_current_user');
    return data ? JSON.parse(data) : null;
}