import axios from 'axios';
import { getSavedToken } from '../composables/useAuth';

export const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = getSavedToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
