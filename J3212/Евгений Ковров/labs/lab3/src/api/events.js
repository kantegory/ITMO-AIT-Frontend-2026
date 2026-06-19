import apiClient from './axios';

export async function fetchEvents(params = {}) {
  const response = await apiClient.get('/events', {
    params
  });

  return response.data;
}

export async function fetchEventById(id) {
  const response = await apiClient.get(`/events/${id}`, {
    params: {
      _ts: Date.now()
    }
  });

  return response.data;
}

export async function createEvent(payload) {
  const response = await apiClient.post('/events', payload);
  return response.data;
}

export async function updateEvent(id, payload) {
  const response = await apiClient.put(`/events/${id}`, payload);
  return response.data;
}
