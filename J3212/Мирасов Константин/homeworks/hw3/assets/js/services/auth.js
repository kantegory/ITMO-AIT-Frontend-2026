import { requestJson } from './http.js';

export function login(email, password) {
  return requestJson('/login', { method: 'POST', body: { email, password } });
}

export function register(email, password, displayName) {
  return requestJson('/register', { method: 'POST', body: { email, password, displayName } });
}
