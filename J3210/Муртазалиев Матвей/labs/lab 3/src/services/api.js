import axios from "axios";
import { API_BASE_URL } from "./config";
import { clearStoredSession, loadStoredSession } from "./sessionStorage";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const session = loadStoredSession();

  if (session?.accessToken && config.auth !== false) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error("API недоступен, нужен `npm run api`"));
    }

    if (error.response.status === 401 || error.response.status === 403) {
      clearStoredSession();
    }

    const data = error.response.data;
    const message = data?.message || data?.error || (typeof data === "string" ? data : "") || "Ошибка запроса к API.";
    return Promise.reject(new Error(message));
  },
);

export async function apiRequest(path, options = {}) {
  const response = await apiClient({
    url: path,
    method: options.method || "GET",
    data: options.body,
    auth: options.auth,
    headers: options.token ? { Authorization: `Bearer ${options.token}` } : undefined,
  });

  return response.data;
}

