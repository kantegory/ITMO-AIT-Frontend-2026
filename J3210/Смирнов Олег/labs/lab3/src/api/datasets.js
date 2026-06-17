import apiClient from './client';

export async function getDatasets() {
  const { data } = await apiClient.get('/datasets');
  return data;
}

export async function getDatasetById(id) {
  const { data } = await apiClient.get(`/datasets/${id}`);
  return data;
}
