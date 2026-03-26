import api from './api.js';

export async function getRegisteredModels() {
    try {
        const response = await api.get('/660/modelss');
        return response.data;
    } catch (error) {
        console.error('Error fetching models:', error);
        return [];
    }
}

export async function createRegisteredModel(name, description) {
    const user = JSON.parse(localStorage.getItem('user'));
    
    const newModel = {
        name,
        description,
        userId: user.id,
        author: user.username || 'Unknown', 
        version: "v1.0",                    
        tags: [],                           
        createdAt: new Date().toISOString()
    };
    
    const response = await api.post('/660/modelss', newModel);
    return response.data;
}