import api from './instance';

export const bookingsApi = {
    getByUserId: (userId) =>
        api.get(`/bookings?userId=${userId}`).then(res => res.data),
    create: (bookingData) =>
        api.post('/bookings', bookingData).then(res => res.data)
};