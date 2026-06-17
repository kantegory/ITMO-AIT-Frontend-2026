import apiClient from './client';

export async function loginUser(email, password) {
  const { data } = await apiClient.get('/users', {
    params: { email, password },
  });
  return data[0] || null;
}

export async function getUserByEmail(email) {
  const { data } = await apiClient.get('/users', { params: { email } });
  return data[0] || null;
}

export async function registerUser(payload) {
  const { data } = await apiClient.post('/users', payload);
  return data;
}

export async function updateUser(id, patch) {
  const { data } = await apiClient.patch(`/users/${id}`, patch);
  return data;
}
