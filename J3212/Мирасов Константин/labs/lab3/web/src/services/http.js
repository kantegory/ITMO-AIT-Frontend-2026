import axios from 'axios';
import { session, clearSession } from '../composables/useSession.js';

export const api = axios.create({ baseURL: '/api', timeout: 10000 });

export async function requestJson(path, { method = 'GET', body, authenticated = false } = {}) {
  const token = session.value?.accessToken;

  try {
    const response = await api.request({
      url: path,
      method,
      data: body,
      headers: authenticated && token ? { Authorization: `Bearer ${token}` } : {},
    });

    return response.data;
  } catch (cause) {
    const status = cause.response?.status;

    if (status === 401 && authenticated && token && token === session.value?.accessToken) {
      clearSession('expired');
    }

    const error = new Error(
      status ? `Request failed (${status}).` : 'Cannot reach the API. Try again.',
    );
    error.status = status;

    throw error;
  }
}

export function getJson(path) {
  return requestJson(path);
}
