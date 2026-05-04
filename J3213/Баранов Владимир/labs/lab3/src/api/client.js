import axios from "axios";

const API_BASE_URL = "http://localhost:3000";
const TOKEN_KEY = "pipelinelab-token";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export { TOKEN_KEY };
