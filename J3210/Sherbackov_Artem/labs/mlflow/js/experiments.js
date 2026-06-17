import api from './api.js';

export async function getExperiments() {
    try {
        const response = await api.get('/660/experiments');
        return response.data;
    } catch (error) {
        console.error('Error fetching experiments:', error);
        if (error.response?.status === 401) {
            alert('Session expired. Please log in again.');
            window.location.href = 'index.html';
        }
        return [];
    }
}

export async function createExperiment(name, model) {
    const user = JSON.parse(localStorage.getItem('user'));
    const newExp = {
        name,
        model,
        userId: user.id,
        createdAt: new Date().toISOString()
    };
    
    const response = await api.post('/660/experiments', newExp);
    return response.data;
}