export const API_BASE_URL = 'http://localhost:3001';
export const CURRENT_USER_STORAGE_KEY = 'currentUser';

function buildUrl(path, params = {}) {
    const url = new URL(`${API_BASE_URL}${path}`);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.set(key, value);
        }
    });

    return url.toString();
}

async function apiRequest(path, options = {}, params = {}) {
    const response = await fetch(buildUrl(path, params), {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Ошибка запроса: ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export function getJSON(path, params = {}) {
    return apiRequest(path, { method: 'GET' }, params);
}

export function postJSON(path, data) {
    return apiRequest(path, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export function saveCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
}

export function getCurrentUser() {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);

    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        console.error('Не удалось прочитать currentUser из localStorage', error);
        return null;
    }
}

export function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}
