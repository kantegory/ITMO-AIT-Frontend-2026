const API_URL = 'http://localhost:3000';

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
}

function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
}

async function authFetch(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    });

    if (response.status === 401) {
        logout();
        window.location.href = 'index.html';
    }

    return response;
}

async function getMyAnnotations(query = '') {
    const user = getCurrentUser();
    const response = await authFetch(`/600/annotations?userId=${user.id}${query}`);

    if (response.status === 403) return [];
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    return response.json();
}
