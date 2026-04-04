function initLogin() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;
        
        if (!email || !password) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        try {
            const response = await api.get('/users', {
                params: { email }
            });
            
            const user = response.data[0];
            
            if (user && user.password === password) {
                localStorage.setItem('token', user.id);
                localStorage.setItem('userEmail', user.email);
                
                console.log('Вход выполнен:', user.email);
                window.location.href = 'dashboard.html';
            } else {
                alert('Неверный email или пароль');
            }
        } catch (error) {
            console.error('Ошибка входа:', error);
            alert('Ошибка сервера');
        }
    });
}

function initRegister() {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;
    
    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email')?.value;
        const username = document.getElementById('username')?.value;
        const password = document.getElementById('password')?.value;
        const passwordConfirm = document.getElementById('password-confirm')?.value;
        const terms = document.getElementById('terms')?.checked;
        
        if (!email || !username || !password || !passwordConfirm) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        if (password !== passwordConfirm) {
            alert('Пароли не совпадают');
            return;
        }
        
        if (password.length < 8) {
            alert('Пароль должен быть не менее 8 символов');
            return;
        }
        
        if (!terms) {
            alert('Необходимо принять условия использования');
            return;
        }
        
        try {
            const response = await api.post('/users', {
                email,
                username,
                password,
                createdAt: new Date().toISOString().split('T')[0]
            });
            
            console.log('Регистрация успешна:', response.data);
            alert('Регистрация успешна! Теперь вы можете войти');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            alert('Ошибка при регистрации. Попробуйте другой email');
        }
    });
}


function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    console.log('Пользователь вышел из системы');
    window.location.href = 'index.html';
}

function checkAuth() {
    const token = localStorage.getItem('token');
    const isAuthPage = document.getElementById('login-form') || document.getElementById('register-form');

    if (!isAuthPage && !token) {
        console.log('Пользователь не авторизован, редирект на вход');
        window.location.href = 'index.html';
        return;
    }
}


document.addEventListener('DOMContentLoaded', function() {
    initLogin();
    initRegister();
    checkAuth();
});