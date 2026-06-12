import api from './axios'

export const AuthAPI = {
    login: (data) => api.post('/login', data),
    register: (data) => api.post('/register', data)
}

export const EventsAPI = {
    getAll: (params) => api.get('/events', { params }),
    getById: (id) => api.get(`/events/${id}`),
    create: (data) => api.post('/events', data),
    update: (id, data) => api.patch(`/events/${id}`, data),
    delete: (id) => api.delete(`/events/${id}`)
}

export const ReviewsAPI = {
    getByEventId: (eventId) => api.get('/reviews', {
        params: { eventId, _sort: 'createdAt', _order: 'desc' }
    }),
    create: (data) => api.post('/reviews', data),
    delete: (id) => api.delete(`/reviews/${id}`)
}

export const TicketsAPI = {
    getByUserId: (userId) => api.get('/tickets', {
        params: { userId, _expand: 'event' }
    }),
    create: (data) => api.post('/tickets', data)
}