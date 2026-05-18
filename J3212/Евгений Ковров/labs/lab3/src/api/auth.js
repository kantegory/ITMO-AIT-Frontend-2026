import apiClient from './axios';

export async function fetchUsersByEmail(email) {
  const response = await apiClient.get('/users', {
    params: {
      email
    }
  });

  return response.data;
}

export async function fetchUserByCredentials(email, password) {
  const response = await apiClient.get('/users', {
    params: {
      email,
      password
    }
  });

  return response.data[0] || null;
}

export async function createUser(payload) {
  const response = await apiClient.post('/users', payload);
  return response.data;
}
