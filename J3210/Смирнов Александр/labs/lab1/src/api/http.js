import axios from "axios";

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    timeout: 8000
});

http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === "ECONNABORTED") {
            return Promise.reject(new Error("Request timeout. Please try again."));
        }

        if (error.response?.status >= 500) {
            return Promise.reject(new Error("Server error. Please try again later."));
        }

        return Promise.reject(error);
    }
);

export default http;
