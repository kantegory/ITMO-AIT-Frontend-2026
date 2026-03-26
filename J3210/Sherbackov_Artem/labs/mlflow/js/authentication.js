import api from './api.js';

export async function login(email, password) {
    try {
        const response = await api.post('/login', { email, password });
        const { accessToken, user } = response.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert('Login failed: ' + (error.response?.data || error.message));
    }
}

export async function signup(username, email, password) {
    try {
        const response = await api.post('/register', { username, email, password });
        alert('Registration successful, try log in');
    } catch (error) {
        alert('Signup failed: ' + (error.response?.data || error.message));
    }
}

export function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}