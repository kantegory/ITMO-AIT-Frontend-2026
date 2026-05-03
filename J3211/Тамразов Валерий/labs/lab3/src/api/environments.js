import http from './http';

export const fetchEnvironments = () => http.get('/environments');
export const fetchRoles = () => http.get('/roles');
