import { getSession, clearSession } from '../session.js';

const apiBase = 'http://127.0.0.1:3001';

export async function requestJson(path, { method = 'GET', body, authenticated = false } = {}) {
  const headers = {};

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  if (authenticated && getSession()) {
    headers.Authorization = `Bearer ${getSession().accessToken}`;
  }

  const response = await fetch(`${apiBase}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
    }

    const error = new Error(`Request failed (${response.status}).`);
    error.status = response.status;

    throw error;
  }

  return response.json();
}

export function getJson(path) {
  return requestJson(path);
}
