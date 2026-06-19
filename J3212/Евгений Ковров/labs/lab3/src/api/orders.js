import apiClient from './axios';

export async function fetchOrdersByUser(userId) {
  const response = await apiClient.get('/orders', {
    params: {
      userId
    }
  });

  return response.data;
}

export async function createOrder(payload) {
  const response = await apiClient.post('/orders', payload);
  return response.data;
}

export async function updateEventTickets(eventId, newAvailableTickets) {
  const response = await apiClient.patch(`/events/${eventId}`, {
    availableTickets: Number(newAvailableTickets)
  });

  return response.data;
}
