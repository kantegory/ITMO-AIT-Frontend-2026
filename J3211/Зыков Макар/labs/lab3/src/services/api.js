import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

function parseRequestBody(body) {
  if (typeof body !== "string") {
    return body;
  }

  try {
    return JSON.parse(body);
  } catch (error) {
    return body;
  }
}

export async function fetchJson(path, options = {}) {
  try {
    const response = await apiClient.request({
      url: path,
      method: options.method || "GET",
      headers: options.headers || {},
      data: parseRequestBody(options.body),
      params: options.params
    });

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Не удалось выполнить запрос к API.";
    throw new Error(message);
  }
}

export { API_BASE_URL };
