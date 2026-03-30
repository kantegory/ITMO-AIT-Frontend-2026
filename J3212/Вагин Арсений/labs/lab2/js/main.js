// Лабораторная 1

document.addEventListener('DOMContentLoaded', function() {
    
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('passwordInput');

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function() {

            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            this.textContent = type === 'password' ? 'Show' : 'Hide';
        });
    }
});

function openProductModal(title, code, price) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalCode').innerText = code;
    document.getElementById('modalPrice').innerText = price;

    var myModal = new bootstrap.Modal(document.getElementById('productModal'));
    myModal.show();
}

function applyFilters() {
    const btn = document.querySelector('#filterForm button');
    const originalText = btn.innerText;
    
    btn.innerText = 'Applying...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerText = originalText;
        btn.disabled = false;
        alert('Filters applied! (JS Mock for Lab 1)');
    }, 800);
}

// Лабораторная 2

const API_URL = 'http://localhost:3000';

// Регистрация
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;

        try {
            const checkResponse = await fetch(`${API_URL}/users?email=${email}`);
            const existingUsers = await checkResponse.json();

            if (existingUsers.length > 0) {
                alert('Ошибка: Пользователь с таким Email уже существует!');
                return;
            }

            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const newUser = await response.json();

            localStorage.setItem('user', JSON.stringify(newUser));
            
            alert('Регистрация прошла успешно!');
            window.location.href = 'profile.html';

        } catch (error) {
            console.error('Ошибка API:', error);
            alert('Нет связи с сервером. Убедитесь, что json-server запущен!');
        }
    });
}

// Вход
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('emailInput').value.trim();
        const password = document.getElementById('passwordInput').value.trim();

        try {
            const response = await fetch(`${API_URL}/users?email=${email}`);
            const users = await response.json();

            if (users.length > 0) {
                const user = users[0];

                if (user.password === password) {
                    localStorage.setItem('user', JSON.stringify(user));
                    window.location.href = 'profile.html';
                } else {
                    alert('Неверный пароль!');
                }
            } else {
                alert('Пользователь с таким Email не найден!');
            }

        } catch (error) {
            console.error('Ошибка API:', error);
            alert('Нет связи с сервером. Убедитесь, что json-server запущен!');
        }
    });
}