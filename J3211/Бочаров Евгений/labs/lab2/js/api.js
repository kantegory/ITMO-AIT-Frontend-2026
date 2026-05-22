// js/api.js
const API_BASE = 'http://localhost:3000';

async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        },
        ...options
    };

    if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);

        if (response.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            window.dispatchEvent(new CustomEvent('auth:logout'));
            throw new Error('Требуется авторизация');
        }

        if (response.status === 204) return null;

        const responseText = await response.text();
        let data;
        try {
            data = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
            console.error('JSON parse error:', e, 'Response:', responseText);
            throw new Error('Ошибка парсинга ответа сервера');
        }

        if (!response.ok) {
            throw new Error(data.message || data.error || `Ошибка ${response.status}`);
        }

        return data;
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            console.error('⚠️ Не удалось соединиться с сервером!');
            console.error('Проверьте:');
            console.error('  1. Запущен ли JSON Server: npm run server');
            console.error('  2. Порт 3000 не занят');
            console.error('  3. CORS разрешён (должен быть --cors в serve)');
            throw new Error('Сервер API недоступен. Запустите: npm run server');
        }
        console.error('API Error:', error);
        throw error;
    }
}

// === AUTH API (прямые запросы на порт 3000, минуя fetchAPI) ===
export const AuthAPI = {
    register: async (userData) => {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const text = await response.text();

        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
            console.error('Сервер вернул HTML вместо JSON!');
            console.error('URL: http://localhost:3000/register');
            throw new Error('Сервер авторизации недоступен. Убедитесь, что json-server запущен на порту 3000.');
        }

        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
            throw new Error(data.message || 'Ошибка регистрации');
        }

        return data;
    },

    login: async (credentials) => {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        const text = await response.text();

        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
            console.error('Сервер вернул HTML вместо JSON!');
            console.error('URL: http://localhost:3000/login');
            console.error('Проверьте, что json-server запущен на порту 3000');
            throw new Error('Сервер авторизации недоступен. Проверьте, запущен ли API-сервер.');
        }

        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
            throw new Error(data.message || 'Неверный email или пароль');
        }

        return data;
    }
};

// === EVENTS ===
export const EventsAPI = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchAPI(`/events${query ? '?' + query : ''}`);
    },

    getById: (id) => fetchAPI(`/events/${id}`),

    create: async (eventData) => {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:3000/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(eventData)
        });

        const text = await response.text();

        // Проверка на HTML вместо JSON
        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
            throw new Error('Сервер вернул HTML. Проверьте, что json-server запущен на порту 3000.');
        }

        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
            throw new Error(data.message || `Ошибка ${response.status}`);
        }

        // возвращаем данные с сервера, включая сгенерированный ID
        return data;
    },

    update: async (id, eventData) => {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:3000/events/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(eventData)
        });

        const text = await response.text();
        if (text.trim().startsWith('<!DOCTYPE')) throw new Error('Сервер вернул HTML');

        const data = text ? JSON.parse(text) : {};
        if (!response.ok) throw new Error(data.message || `Ошибка ${response.status}`);
        return data;
    },

    delete: async (id) => {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:3000/events/${id}`, {
            method: 'DELETE',
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        });

        if (!response.ok) {
            const text = await response.text();
            if (text) {
                const data = JSON.parse(text);
                throw new Error(data.message || `Ошибка ${response.status}`);
            }
            throw new Error(`Ошибка ${response.status}`);
        }
        return { success: true };
    }
};

// === REVIEWS ===
export const ReviewsAPI = {
    getByEventId: (eventId) =>
        fetchAPI(`/reviews?eventId=${eventId}&_sort=createdAt&_order=desc`),
    create: (reviewData) => fetchAPI('/reviews', {
        method: 'POST',
        body: reviewData
    }),
    delete: (id) => fetchAPI(`/reviews/${id}`, { method: 'DELETE' })
};

// === TICKETS ===
export const TicketsAPI = {
    getByUserId: (userId) =>
        fetchAPI(`/tickets?userId=${userId}&_expand=event`),
    create: (ticketData) => fetchAPI('/tickets', {
        method: 'POST',
        body: ticketData
    }),
    update: (id, ticketData) => fetchAPI(`/tickets/${id}`, {
        method: 'PATCH',
        body: ticketData
    })
};

// === USERS ===
export const UsersAPI = {
    getCurrent: () => {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },
    getById: (id) => fetchAPI(`/users/${id}`),
    update: (id, userData) => fetchAPI(`/users/${id}`, {
        method: 'PATCH',
        body: userData
    })
};

export { fetchAPI };