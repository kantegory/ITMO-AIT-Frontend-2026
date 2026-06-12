
import { AuthAPI } from './api.js';

const AUTH_STORAGE = {
    TOKEN: 'authToken',
    USER: 'currentUser'
};

export const Auth = {
    async register(userData) {
        try {
            const data = await AuthAPI.register(userData);
            if (data.accessToken) {
                localStorage.setItem(AUTH_STORAGE.TOKEN, data.accessToken);
                localStorage.setItem(AUTH_STORAGE.USER, JSON.stringify(data.user));
                window.dispatchEvent(new CustomEvent('auth:login', { detail: data.user }));
                // Редирект в профиль
                window.location.href = 'profile.html';
                return data.user;
            }
            return await this.login({ email: userData.email, password: userData.password });
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    async login(credentials) {
        try {
            const data = await AuthAPI.login(credentials);

            if (!data.accessToken) {
                throw new Error('Сервер не вернул токен авторизации');
            }

            localStorage.setItem(AUTH_STORAGE.TOKEN, data.accessToken);
            localStorage.setItem(AUTH_STORAGE.USER, JSON.stringify(data.user));

            window.dispatchEvent(new CustomEvent('auth:login', { detail: data.user }));
            // Редирект в профиль
            window.location.href = 'profile.html';
            return data.user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem(AUTH_STORAGE.TOKEN);
        localStorage.removeItem(AUTH_STORAGE.USER);
        window.dispatchEvent(new CustomEvent('auth:logout'));
    },

    isAuthenticated() {
        return !!localStorage.getItem(AUTH_STORAGE.TOKEN);
    },

    getCurrentUser() {
        const user = localStorage.getItem(AUTH_STORAGE.USER);
        return user ? JSON.parse(user) : null;
    },

    hasRole(role) {
        const user = this.getCurrentUser();
        return user?.role === role;
    },

    init() {
        window.addEventListener('auth:logout', () => {
            if (window.location.pathname.match(/(profile|organizer)\.html$/)) {
                window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
            }
            this.updateUI();
        });

        window.addEventListener('auth:login', () => {
            this.updateUI();
            const redirect = new URLSearchParams(window.location.search).get('redirect');
            if (redirect && redirect !== window.location.pathname) {
                window.location.href = redirect;
            }
        });

        this.updateUI();
    },

    updateUI() {
        const isAuthenticated = this.isAuthenticated();

        document.querySelectorAll('[data-auth-guest]').forEach(el => {
            el.style.display = isAuthenticated ? 'none' : '';
        });

        document.querySelectorAll('[data-auth-user]').forEach(el => {
            el.style.display = isAuthenticated ? '' : 'none';
        });

        document.querySelectorAll('[data-role-organizer]').forEach(el => {
            el.style.display = this.hasRole('organizer') ? '' : 'none';
        });

        const user = this.getCurrentUser();
        if (user) {
            const nameEl = document.getElementById('profile-name');
            const emailEl = document.getElementById('profile-email');
            if (nameEl) nameEl.textContent = `${user.firstName} ${user.lastName}`;
            if (emailEl) emailEl.textContent = user.email;
        }
    }
};