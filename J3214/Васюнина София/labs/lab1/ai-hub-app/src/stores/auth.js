import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    accessToken: localStorage.getItem('accessToken') || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken,
    userName: (state) => state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
  },
  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('http://localhost:3000/login', credentials);
        this.setAuth(response.data);
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Неверный логин или пароль' 
        };
      }
    },
    async register(userData) {
      try {
        const response = await axios.post('http://localhost:3000/signup', userData);
        this.setAuth(response.data);
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Ошибка при регистрации' 
        };
      }
    },
    async updateProfile(updatedData) {
      try {
        const response = await axios.patch(`http://localhost:3000/users/${this.user.id}`, updatedData);
        this.user = response.data;
        localStorage.setItem('user', JSON.stringify(response.data));
        return { success: true };
      } catch (error) {
        return { success: false, message: 'Ошибка обновления профиля' };
      }
    },
    setAuth(data) {
      this.user = data.user;
      this.accessToken = data.accessToken;
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('accessToken', data.accessToken);
    },
    logout() {
      this.user = null;
      this.accessToken = null;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    }
  },
});