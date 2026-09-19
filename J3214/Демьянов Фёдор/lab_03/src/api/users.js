import api from './instance';

export const usersApi = {
    getByCredentials: (email, password) =>
        api.get(`/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`).then(res => res.data),
    getByEmail: (email) =>
        api.get(`/users?email=${encodeURIComponent(email)}`).then(res => res.data),
    getById: (id) =>
        api.get(`/users/${id}`).then(res => res.data),
    create: (userData) =>
        api.post('/users', userData).then(res => res.data),
    updateCabinSettings: (id, cabinSettings) =>
        api.patch(`/users/${id}`, { cabinSettings }).then(res => res.data)
};