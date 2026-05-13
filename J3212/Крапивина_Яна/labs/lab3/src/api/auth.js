import axios from 'axios';

export const authService = {
    async login(email, password) {
        try {
            const response = await axios.get(`http://localhost:3000/users?email=${email.toLowerCase()}`);
            const users = response.data;
            if (users.length > 0) {
                const user = users[0];
                if (String(user.password) === String(password)) {
                    localStorage.setItem('userName', user.name);
                    localStorage.setItem('userId', user.id);
                    return { success: true };
                }
            }
            return { success: false, message: 'Неверные данные' };
        } catch (e) { throw new Error('Сервер недоступен'); }
    }
};

export const themeService = {
    applyTheme(theme) {
        const html = document.documentElement;
        if (theme === 'light') {
            html.classList.add('light-theme');
            localStorage.setItem('user-theme', 'light');
        } else {
            html.classList.remove('light-theme');
            localStorage.setItem('user-theme', 'dark');
        }
    },
    init() {
        const saved = localStorage.getItem('user-theme') || 'dark';
        this.applyTheme(saved);
    }
};