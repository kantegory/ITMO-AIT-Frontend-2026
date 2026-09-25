const API_URL = 'http://localhost:3000';

// Глобальное состояние
let transactions = [];
let goals = [];
let categories = [];
let banks = [];
let rules = []; 
let currentUser = null;
let itemToDelete = { id: null, type: null };

// Проверка авторизации
function checkAuth() {
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    const currentPath = window.location.pathname;
    
    if (!token || !userStr) {
        if (!currentPath.includes('login.html') && !currentPath.includes('register.html')) {
            window.location.href = 'login.html';
        }
        return false;
    }
    currentUser = JSON.parse(userStr);
    return true;
}

// Выход из аккаунта
function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Базовый метод для API запросов
async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('accessToken');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };

    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
        const errText = await response.text();
        console.error(`Ошибка сервера ${response.status}:`, errText);
        if (response.status === 401 || response.status === 403) {
            alert("Ошибка доступа! Попробуйте разлогиниться и войти снова.");
        }
        throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
}

// Загрузка данных текущего пользователя с сервера
async function loadServerData() {
    try {
        const [tData, gData, cData, bData, rData] = await Promise.all([
            apiFetch(`/transactions?userId=${currentUser.id}`),
            apiFetch(`/goals?userId=${currentUser.id}`),
            apiFetch(`/categories?userId=${currentUser.id}`),
            apiFetch(`/banks?userId=${currentUser.id}`),
            apiFetch(`/rules?userId=${currentUser.id}`)
        ]);
        
        transactions = tData;
        goals = gData;
        categories = cData;
        banks = bData;
        rules = rData;
        
        initAppUI(); 
    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
    }
}