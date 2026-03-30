const API_BASE_URL = "http://localhost:3000";

function apiClient() {
    const client = axios.create({
        baseURL: API_BASE_URL,
        timeout: 5000
    });

    client.interceptors.request.use(function (config) {
        const token = apiGetAccessToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = "Bearer " + token;
        }
        return config;
    });

    return client;
}

function apiGetCurrentUserId() {
    const user = apiGetCurrentUser();
    if (!user) {
        return null;
    }
    return Number(user.id);
}

function apiGetCurrentUsername() {
    const user = apiGetCurrentUser();
    if (!user) {
        return null;
    }
    return user.username || user.email || null;
}

function apiSetSession(accessToken, user) {
    localStorage.setItem("accessToken", String(accessToken));
    localStorage.setItem("user", JSON.stringify(user));
}

function apiClearSession() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
}

function apiGetAccessToken() {
    return localStorage.getItem("accessToken");
}

function apiGetCurrentUser() {
    const raw = localStorage.getItem("user");
    if (!raw) {
        return null;
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}