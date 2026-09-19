const API_BASE_URL = 'http://localhost:3000';

/**
 * Базовая функция-обертка над fetch
 * @param {string} endpoint - путь эндпоинта (например, '/tours')
 * @param {object} options - параметры fetch (method, body, headers)
 */
async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Сетевой сбой при запросе к ${url}:`, error);
        throw error;
    }
}

// Экспорт методов для работы с REST API
window.api = {
    get(endpoint) {
        return request(endpoint, { method: 'GET' });
    },
    post(endpoint, data) {
        return request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    patch(endpoint, data) {
        return request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    },
    delete(endpoint) {
        return request(endpoint, { method: 'DELETE' });
    }
};