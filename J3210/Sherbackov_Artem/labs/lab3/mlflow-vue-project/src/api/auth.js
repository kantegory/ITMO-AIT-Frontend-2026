import { api } from './instance';

export const authApi = {
  findUserByEmail(email) {
    return api.get(`/users?email=${email}`);
  },
  
  register(userData) {
    return api.post('/users', userData);
  }
};