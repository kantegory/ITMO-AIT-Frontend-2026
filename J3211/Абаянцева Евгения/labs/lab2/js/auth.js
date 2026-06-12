function saveUserData(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
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

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Вход...';

            try {
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                const user = await authAPI.login(email, password);
                
                saveUserData(user);
                
                showNotification('Успешный вход! Перенаправление...', 'success');
                setTimeout(() => {
                    window.location.href = 'user-dashboard.html';
                }, 1000);
                
            } catch (error) {
                showNotification(error.message || 'Ошибка входа', 'danger');
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
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

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Регистрация...';

            try {
                const userData = {
                    name: document.getElementById('firstName').value + ' ' + 
                          document.getElementById('lastName').value,
                    email: document.getElementById('regEmail').value,
                    password: document.getElementById('regPassword').value
                };
                
                const user = await authAPI.register(userData);
                
                saveUserData(user);
                
                showNotification('Регистрация успешна! Добро пожаловать.', 'success');
                setTimeout(() => {
                    window.location.href = 'user-dashboard.html';
                }, 1000);
                
            } catch (error) {
                showNotification(error.message || 'Ошибка регистрации', 'danger');
                btn.disabled = false;
                btn.innerText = originalText;
            }
        } else {
            form.classList.add('was-validated');
        }
    });
}

function showNotification(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    handleLoginForm();
    handleRegisterForm();
    displayUserData();
});