import { api } from './instance';

export const experimentsApi = {
  getAll() {
    return api.get('/experiments');
  },
  
  create(experimentData) {
    return api.post('/experiments', experimentData);
  },

  delete: (id) => api.delete(`/experiments/${id}`)
};