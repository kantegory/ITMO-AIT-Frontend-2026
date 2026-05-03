import { api } from './instance';

export const modelsApi = {
  getAll() {
    return api.get('/modelss'); 
  },
  getById(id) {
    return api.get(`/modelss/${id}`);
  },
  create(data) {
    return api.post('/modelss', data);
  },
  delete(id) {
    return api.delete(`/modelss/${id}`);
  }
};