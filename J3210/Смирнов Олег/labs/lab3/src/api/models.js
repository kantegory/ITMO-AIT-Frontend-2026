import apiClient from './client';

export async function getModels() {
  const { data } = await apiClient.get('/models');
  return data;
}

export async function getModelById(id) {
  const { data } = await apiClient.get(`/models/${id}`);
  return data;
}
