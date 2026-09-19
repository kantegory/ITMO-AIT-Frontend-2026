import api from './instance';

export const toursApi = {
    getAll: () => api.get('/tours').then(res => res.data),
    getById: (id) => api.get(`/tours/${id}`).then(res => res.data)
};