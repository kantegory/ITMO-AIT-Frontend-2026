const AUTH_STORAGE_KEY = 'nova_user';

window.auth = {
    // Получение данных текущего авторизованного пользователя
    getCurrentUser() {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    },

    // Сохранение сессии
    setCurrentUser(user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    },

    // Выход из системы
    logout() {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        window.location.href = 'login.html';
    },

    // Проверка доступа: перенаправляет на логин, если сессии нет
    requireAuth() {
        const user = this.getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return null;
        }
        return user;
    },

    // Вход в систему через сверку с json-server
    async login(email, password) {
        // Запрос с фильтрацией по двум полям
        const users = await window.api.get(`/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);

        if (users.length === 0) {
            throw new Error('Неверный бортовой email или ключ доступа');
        }

        const user = users[0];
        this.setCurrentUser(user);
        return user;
    },

    // Регистрация нового исследователя
    async register(name, email, password) {

        // Проверяем, свободен ли email
        const existing = await window.api.get(`/users?email=${encodeURIComponent(email)}`);
        if (existing.length > 0) {
            throw new Error('Исследователь с таким email уже зарегистрирован');
        }

        // Формируем досье по схеме базы
        const randomCode = 'NT-' + Math.floor(1000 + Math.random() * 9000) + '-X';
        const newUser = {
            name,
            email,
            password,
            code: randomCode,
            class: "Cadet Class",
            isDeepSpaceMember: false,
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1e29&color=c8d0db&size=96`,
            cabinSettings: {
                gravity: true,
                hypoallergenicFood: false,
                windowDimming: false
            },
            trainingProgress: {
                centrifuge: 0,
                docking: 0,
                suitFitting: 0
            }
        };

        // Сохраняем на сервере
        const createdUser = await window.api.post('/users', newUser);
        this.setCurrentUser(createdUser);
        return createdUser;
    },

    // Динамическое переключение элементов навбара на любой странице
    initNavbar() {
        const user = this.getCurrentUser();

        // Ищем ссылки на кабинет
        const dashboardLinks = document.querySelectorAll('a[href*="dashboard.html"]');
        // Ищем ссылки на вход и регистрацию
        const authLinks = document.querySelectorAll('a[href*="login.html"], a[href*="register.html"]');

        if (user) {
            // Исследователь авторизован: скрываем "Войти" и "Регистрация"
            authLinks.forEach(el => el.classList.add('d-none'));

            // Показываем "Кабинет" и обновляем имя с аватаром
            dashboardLinks.forEach(el => {
                const navItem = el.closest('.nav-item');
                if (navItem) navItem.classList.remove('d-none');
                el.classList.remove('d-none');
            });

            const profileBtn = document.querySelector('.profile-nav-btn');
            if (profileBtn) {
                profileBtn.classList.remove('d-none');
                const avatar = profileBtn.querySelector('img');
                const nameSpan = profileBtn.querySelector('span');
                if (avatar) {
                    avatar.src = user.avatarUrl;
                    avatar.alt = `Аватар профиля: ${user.name}`;
                }
                if (nameSpan) nameSpan.textContent = user.name;
            }
        } else {
            // Гость: показываем "Войти" и "Регистрация"
            authLinks.forEach(el => el.classList.remove('d-none'));

            // Скрываем все ссылки на личный кабинет
            dashboardLinks.forEach(el => {
                const navItem = el.closest('.nav-item');
                if (navItem) navItem.classList.add('d-none');
                el.classList.add('d-none');
            });
        }
    }
};

// Запуск отрисовки навбара после загрузки структуры документа
document.addEventListener('DOMContentLoaded', () => {
    window.auth.initNavbar();
});