import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    headers: {
        "Content-Type": "application/json"
    }
});

export async function request(path, options = {}) {
    const response = await api.request({
        url: path,
        method: options.method || "GET",
        data: options.body,
        headers: options.headers
    });
    return response.status === 204 ? null : response.data;
}
