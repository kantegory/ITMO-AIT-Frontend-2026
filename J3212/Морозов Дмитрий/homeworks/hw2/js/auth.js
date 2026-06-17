function showNotification(message, type = 'info', containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Контейнер уведомлений #${containerId} не найден`);
        return;
    }
    
    container.textContent = '';
    container.className = `alert alert-${type} mt-3`;
    container.setAttribute('role', 'alert');
    container.setAttribute('aria-live', 'assertive');
    container.setAttribute('aria-atomic', 'true');
    
    container.textContent = message;
    container.classList.remove('visually-hidden');
    
    container.focus?.();
    
    if (type === 'success') {
        setTimeout(() => {
            container.classList.add('visually-hidden');
            container.textContent = '';
        }, 5000);
    }
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorContainer = document.getElementById(`${fieldId}-error`);
    
    if (!field || !errorContainer) return;
    
    field.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');
    
    errorContainer.textContent = message;
    errorContainer.classList.remove('visually-hidden');
    
    field.setAttribute('aria-describedby', `${fieldId}-hint ${fieldId}-error`);
    
    field.focus();
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorContainer = document.getElementById(`${fieldId}-error`);
    
    if (field) {
        field.classList.remove('is-invalid');
        field.setAttribute('aria-invalid', 'false');
        field.setAttribute('aria-describedby', `${fieldId}-hint`);
    }
    if (errorContainer) {
        errorContainer.textContent = '';
        errorContainer.classList.add('visually-hidden');
    }
}

function initLogin() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const errorContainer = document.getElementById('login-error');
    
    [emailInput, passwordInput].forEach(input => {
        input?.addEventListener('input', () => {
            clearFieldError(input.id);
            if (errorContainer) {
                errorContainer.classList.add('visually-hidden');
                errorContainer.textContent = '';
            }
        });
    });
    
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        clearFieldError('login-email');
        clearFieldError('login-password');
        if (errorContainer) {
            errorContainer.classList.add('visually-hidden');
            errorContainer.textContent = '';
        }
        
        const email = emailInput?.value.trim();
        const password = passwordInput?.value;
        
        let hasErrors = false;
        
        if (!email) {
            showFieldError('login-email', 'Введите email');
            hasErrors = true;
        } else if (!isValidEmail(email)) {
            showFieldError('login-email', 'Введите корректный email');
            hasErrors = true;
        }
        
        if (!password) {
            showFieldError('login-password', 'Введите пароль');
            hasErrors = true;
        }
        
        if (hasErrors) return;
        
        try {
            const response = await api.get('/users', { params: { email } });
            const user = response.data[0];
            
            if (user && user.password === password) {
                localStorage.setItem('token', user.id);
                localStorage.setItem('userEmail', user.email);
                
                console.log('Вход выполнен:', user.email);
                showNotification('Вход выполнен успешно!', 'success', 'login-error');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showNotification('Неверный email или пароль', 'danger', 'login-error');
                passwordInput?.focus();
            }
        } catch (error) {
            console.error('Ошибка входа:', error);
            showNotification('Ошибка сервера. Попробуйте позже', 'danger', 'login-error');
        }
    });
}

function initRegister() {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;
    
    const emailInput = document.getElementById('register-email');
    const usernameInput = document.getElementById('register-username');
    const passwordInput = document.getElementById('register-password');
    const passwordConfirmInput = document.getElementById('register-password-confirm');
    const termsCheckbox = document.getElementById('register-terms');
    const errorContainer = document.getElementById('register-error');
    
    [emailInput, usernameInput, passwordInput, passwordConfirmInput].forEach(input => {
        input?.addEventListener('input', () => clearFieldError(input.id));
    });
    termsCheckbox?.addEventListener('change', () => {
        if (errorContainer) {
            errorContainer.classList.add('visually-hidden');
            errorContainer.textContent = '';
        }
    });
    
    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        ['register-email', 'register-username', 'register-password', 'register-password-confirm'].forEach(clearFieldError);
        if (errorContainer) {
            errorContainer.classList.add('visually-hidden');
            errorContainer.textContent = '';
        }
        
        const email = emailInput?.value.trim();
        const username = usernameInput?.value.trim();
        const password = passwordInput?.value;
        const passwordConfirm = passwordConfirmInput?.value;
        const terms = termsCheckbox?.checked;
        
        let hasErrors = false;
        
        if (!email) {
            showFieldError('register-email', 'Введите email');
            hasErrors = true;
        } else if (!isValidEmail(email)) {
            showFieldError('register-email', 'Введите корректный email');
            hasErrors = true;
        }
        
        if (!username) {
            showFieldError('register-username', 'Введите имя пользователя');
            hasErrors = true;
        }
        
        if (!password) {
            showFieldError('register-password', 'Введите пароль');
            hasErrors = true;
        } else if (password.length < 8) {
            showFieldError('register-password', 'Пароль должен быть не менее 8 символов');
            hasErrors = true;
        }
        
        if (!passwordConfirm) {
            showFieldError('register-password-confirm', 'Подтвердите пароль');
            hasErrors = true;
        } else if (password !== passwordConfirm) {
            showFieldError('register-password-confirm', 'Пароли не совпадают');
            hasErrors = true;
        }
        
        if (!terms) {
            showNotification('Необходимо принять условия использования', 'warning', 'register-error');
            termsCheckbox?.focus();
            hasErrors = true;
        }
        
        if (hasErrors) return;
        
        try {
            await api.post('/users', {
                email,
                username,
                password,
                createdAt: new Date().toISOString().split('T')[0]
            });
            
            console.log('Регистрация успешна');
            showNotification('Регистрация успешна! Теперь вы можете войти', 'success', 'register-error');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            showNotification('Ошибка при регистрации. Попробуйте другой email', 'danger', 'register-error');
            emailInput?.focus();
        }
    });
}


function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initLogin();
    initRegister();
    checkAuth();
});