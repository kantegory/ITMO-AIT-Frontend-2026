(function () {
    const API_URL = 'http://localhost:3000';

    function updateNavbar() {
        const token = localStorage.getItem('accessToken');
        const navActions = document.querySelector('.d-flex.align-items-center.gap-3');
        if (!navActions) return;

        const loginBtn = navActions.querySelector('[data-bs-target="#loginModal"]');
        const registerBtn = navActions.querySelector('[data-bs-target="#registerModal"]');

        if (token) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';

            if (!document.getElementById('nav-user-info')) {
                navActions.insertAdjacentHTML('beforeend', `
                    <span id="nav-user-info" class="d-flex align-items-center gap-2">
                        <span class="text-muted">${user.name || user.email}</span>
                        <button class="btn btn-outline-danger" id="logoutBtn">Выйти</button>
                    </span>
                `);
                document.getElementById('logoutBtn').addEventListener('click', function () {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('user');
                    window.location.href = 'index.html';
                });
            }
        }
    }

    if (document.getElementById('loginModal')) return;

    const markup = `
<div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title fs-5" id="loginModalLabel">Вход</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
            </div>
            <div class="modal-body">
                <div id="loginError" class="alert alert-danger d-none"></div>
                <form id="loginForm">
                    <div class="mb-3">
                        <label for="loginEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="loginEmail" name="email" required autocomplete="email">
                    </div>
                    <div class="mb-3">
                        <label for="loginPassword" class="form-label">Пароль</label>
                        <input type="password" class="form-control" id="loginPassword" name="password" required autocomplete="current-password">
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Войти</button>
                </form>
            </div>
            <div class="modal-footer justify-content-center">
                <span class="text-muted">Нет аккаунта?</span>
                <button type="button" class="btn btn-link p-0" data-bs-toggle="modal" data-bs-target="#registerModal">Зарегистрироваться</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title fs-5" id="registerModalLabel">Регистрация</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
            </div>
            <div class="modal-body">
                <div id="registerError" class="alert alert-danger d-none"></div>
                <form id="registerForm">
                    <div class="mb-3">
                        <label for="registerName" class="form-label">Имя</label>
                        <input type="text" class="form-control" id="registerName" name="name" required autocomplete="name">
                    </div>
                    <div class="mb-3">
                        <label for="registerEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="registerEmail" name="email" required autocomplete="email">
                    </div>
                    <div class="mb-3">
                        <label for="registerPassword" class="form-label">Пароль</label>
                        <input type="password" class="form-control" id="registerPassword" name="password" required autocomplete="new-password" minlength="6">
                    </div>
                    <div class="mb-3">
                        <label for="registerPasswordConfirm" class="form-label">Подтвердите пароль</label>
                        <input type="password" class="form-control" id="registerPasswordConfirm" name="passwordConfirm" required autocomplete="new-password" minlength="6">
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Зарегистрироваться</button>
                </form>
            </div>
            <div class="modal-footer justify-content-center">
                <span class="text-muted">Уже есть аккаунт?</span>
                <button type="button" class="btn btn-link p-0" data-bs-toggle="modal" data-bs-target="#loginModal">Войти</button>
            </div>
        </div>
    </div>
</div>
`;

    document.body.insertAdjacentHTML('beforeend', markup);

    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const loginData = {};
        formData.forEach((value, key) => loginData[key] = value);

        const errorEl = document.getElementById('loginError');
        errorEl.classList.add('d-none');

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                body: JSON.stringify(loginData),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                errorEl.textContent = 'Неверный email или пароль';
                errorEl.classList.remove('d-none');
                return;
            }

            const { accessToken, user } = await response.json();
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(user));

            window.location.href = 'profile.html';
        } catch {
            errorEl.textContent = 'Ошибка соединения с сервером';
            errorEl.classList.remove('d-none');
        }
    });

    document.getElementById('registerForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const password = document.getElementById('registerPassword').value;
        const confirm = document.getElementById('registerPasswordConfirm').value;

        const errorEl = document.getElementById('registerError');
        errorEl.classList.add('d-none');

        if (password !== confirm) {
            document.getElementById('registerPasswordConfirm').setCustomValidity('Пароли не совпадают');
            document.getElementById('registerPasswordConfirm').reportValidity();
            return;
        }
        document.getElementById('registerPasswordConfirm').setCustomValidity('');

        const formData = new FormData(e.target);
        const registerData = {};
        formData.forEach((value, key) => registerData[key] = value);
        delete registerData.passwordConfirm;

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                body: JSON.stringify(registerData),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                errorEl.textContent = 'Ошибка регистрации. Email уже занят?';
                errorEl.classList.remove('d-none');
                return;
            }

            const { accessToken, user } = await response.json();
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(user));

            window.location.href = 'profile.html';
        } catch {
            errorEl.textContent = 'Ошибка соединения с сервером';
            errorEl.classList.remove('d-none');
        }
    });

    document.getElementById('registerPasswordConfirm').addEventListener('input', function () {
        this.setCustomValidity('');
    });

    document.addEventListener('DOMContentLoaded', updateNavbar);
})();
