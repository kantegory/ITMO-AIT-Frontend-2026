document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'http://localhost:3000';

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            registerError.classList.add('data-none', 'd-none');

            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim().toLowerCase();
            const password = document.getElementById('reg-password').value;
            const role = document.getElementById('reg-role').value;

            try {
                const checkUserResponse = await axios.get(`${API_BASE}/users`, {
                    params: { email: email }
                });

                if (checkUserResponse.data.length > 0) {
                    showError(registerError, 'Пользователь с таким Email уже зарегистрирован');
                    return;
                }

                const newUser = { name, email, password, role };
                const createResponse = await axios.post(`${API_BASE}/users`, newUser);

                if (createResponse.status === 201) {
                    localStorage.setItem('currentUser', JSON.stringify(createResponse.data));

                    if (createResponse.data.role === 'organizer') {
                        window.location.href = 'org_profile.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }

            } catch (error) {
                console.error('Ошибка при регистрации:', error);
                showError(registerError, 'Произошла ошибка на сервере. Попробуйте позже.');
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            loginError.classList.add('d-none');

            const email = document.getElementById('login-email').value.trim().toLowerCase();
            const password = document.getElementById('login-password').value;
            
            try {
                const response = await axios.get(`${API_BASE}/users`, {
                    params: { email: email }
                });

                const users = response.data;

                if (users.length === 0) {
                    showError(loginError, 'Неверный email или пароль');
                    return;
                }

                const user = users[0];

                if (String(user.password) !== String(password)) {
                    showError(loginError, 'Неверный email или пароль');
                    return;
                }

                localStorage.setItem('currentUser', JSON.stringify(user));

                if (user.role === 'organizer') {
                    window.location.href = 'org_profile.html';
                } else {
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.error('Ошибка при авторизации:', error);
                showError(loginError, 'Произошла ошибка на сервере. Попробуйте позже.');
            }
        });
    }

    function showError(element, message) {
        element.innerText = message;
        element.classList.remove('d-none');
    }
});