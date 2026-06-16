function saveUserData(name, email) {
    const userData = {
        name: name,
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=dc2626&color=fff&size=100`
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));
}

function getCurrentUser() {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
}

function logout() {
    if (confirm('Вы действительно хотите выйти?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

function displayUserData() {
    const user = getCurrentUser();
    if (!user) return;

    const elements = {
        'userName': user.name,
        'userEmail': user.email,
        'sidebarUserName': user.name,
        'sidebarUserEmail': user.email,
        'userAvatar': user.avatar
    };

    for (const [id, value] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            if (id === 'userAvatar') {
                element.src = value;
            } else {
                element.textContent = value;
            }
        }
    }
}

function requireAuth(redirectUrl = 'login.html') {
    if (!getCurrentUser()) {
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

function handleLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('bi-eye');
            this.querySelector('i').classList.toggle('bi-eye-slash');
        });
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Вход...';

            setTimeout(() => {
                const email = document.getElementById('email').value;
                const name = email.split('@')[0];
                saveUserData(
                    name.charAt(0).toUpperCase() + name.slice(1),
                    email
                );

                alert('Успешный вход! Перенаправление в личный кабинет...');
                window.location.href = 'user-dashboard.html';
                btn.disabled = false;
                btn.innerHTML = originalText;
            }, 1500);
        } else {
            form.classList.add('was-validated');
        }
    });
}

function handleRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    const passwordInput = document.getElementById('regPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    if (passwordInput && confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (passwordInput.value !== confirmPasswordInput.value) {
                confirmPasswordInput.setCustomValidity("Пароли не совпадают");
            } else {
                confirmPasswordInput.setCustomValidity("");
            }
        });

        passwordInput.addEventListener('input', function() {
            if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
                confirmPasswordInput.setCustomValidity("Пароли не совпадают");
            } else {
                confirmPasswordInput.setCustomValidity("");
            }
        });
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Регистрация...';

            setTimeout(() => {
                const email = document.getElementById('regEmail').value;
                const name = document.getElementById('firstName').value + ' ' + 
                             document.getElementById('lastName').value;
                saveUserData(name, email);

                alert('Регистрация успешна! Добро пожаловать.');
                window.location.href = 'user-dashboard.html';
                btn.disabled = false;
                btn.innerText = originalText;
            }, 1500);
        } else {
            form.classList.add('was-validated');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    handleLoginForm();
    handleRegisterForm();
    displayUserData();
});