import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default function useApi() {
    return {
        get: (url, params) => apiClient.get(url, { params }),
        post: (url, data) => apiClient.post(url, data),
        put: (url, data) => apiClient.put(url, data),
        delete: (url) => apiClient.delete(url)
    };
}