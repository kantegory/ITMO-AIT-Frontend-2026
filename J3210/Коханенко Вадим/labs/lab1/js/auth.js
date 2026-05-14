// Регистрация
async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password.length < 8) {
        alert('Пароль должен быть минимум 8 символов.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Пароли не совпадают.');
        return;
    }

    try {
        const data = await api.register({ email, password, name });
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Регистрация успешна!');
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert(error.message || 'Ошибка при регистрации');
    }
}

// Вход
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const data = await api.login({ email, password });
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert('Неверный email или пароль');
    }
}

// Проверка авторизации при загрузке
function checkAuth() {
    if (!api.isAuthenticated()) {
        const protectedPages = ['dashboard.html', 'search.html', 'destination.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage) && currentPage !== 'index.html' && currentPage !== 'register.html') {
            window.location.href = 'index.html';
        }
    }
}

// Обработчики
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const logoutBtn = document.querySelector('a[href="index.html"]');
    if (logoutBtn && logoutBtn.textContent.includes('Выйти')) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            api.logout();
        });
    }
});