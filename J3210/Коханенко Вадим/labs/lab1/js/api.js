const API_URL = 'http://localhost:3000';

const api = {
    async get(endpoint) {
        const response = await fetch(`${API_URL}${endpoint}`);
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        return await response.json();
    },

    async post(endpoint, data) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Ошибка отправки данных');
        return await response.json();
    },

    async put(endpoint, data) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Ошибка обновления данных');
        return await response.json();
    },

    async delete(endpoint) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Ошибка удаления');
        return await response.json();
    },

    async register(userData) {
        const users = await this.get('/users');
        const existingUser = users.find(u => u.email === userData.email);
        
        if (existingUser) {
            throw new Error('Пользователь с таким email уже существует');
        }

        const newUser = {
            id: Date.now().toString(),
            email: userData.email,
            password: userData.password,
            name: userData.name || userData.email.split('@')[0]
        };

        const createdUser = await this.post('/users', newUser);
        
        return {
            accessToken: 'token-' + Date.now(),
            user: {id: createdUser.id, email: createdUser.email, name: createdUser.name            }
        };
    },

    async login(credentials) {
        const users = await this.get('/users');
        const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
        
        if (!user) {
            throw new Error('Неверный email или пароль');
        }

        return {
            accessToken: 'token-' + Date.now(),
            user: {id: user.id, email: user.email, name: user.name}
        };
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    async authGet(endpoint) {
        if (!this.isAuthenticated()) {
            throw new Error('Не авторизован');
        }
        return this.get(endpoint);
    },

    async authPost(endpoint, data) {
        if (!this.isAuthenticated()) {
            throw new Error('Не авторизован');
        }
        return this.post(endpoint, data);
    },

    async authPut(endpoint, data) {
        if (!this.isAuthenticated()) {
            throw new Error('Не авторизован');
        }
        return this.put(endpoint, data);
    },

    async authDelete(endpoint) {
        if (!this.isAuthenticated()) {
            throw new Error('Не авторизован');
        }
        return this.delete(endpoint);
    }
};