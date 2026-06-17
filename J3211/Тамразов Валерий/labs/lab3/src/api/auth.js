import http from './http';

export const login = (credentials) => http.post('/login', credentials);
export const register = (userData) => http.post('/register', userData);
