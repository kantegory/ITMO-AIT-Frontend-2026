const API_URL = 'http://localhost:3000';

function getAuthToken() {
    return localStorage.getItem('accessToken');
}

function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = "login.html";
}

async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? {'Authorization': `Bearer ${token}`} : {}),
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {...options, headers});
        if (response.status === 401) {
            logout();
            return null;
        }
        return await response.json();
    } catch (e) {
        console.error("Ошибка API:", e);
        return null;
    }
}



