import { defineStore } from "pinia";
import api from '@/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
    }),
    getters: {
        isLoggedIn: (state) => !!state.token,
    },
    actions: {
        async login(email, password) {
            const response = await api.post('/login', { email, password });
            this.token = response.data.accessToken;
            this.user = response.data.user;
            localStorage.setItem('token', this.token);
            return response.data;
        },
        async register(userData) {
            const response = await api.post('/users', userData);
            return response.data;
        },
        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
        },

        async fetchProfile() {
            if (!this.user) return;
            const res = await api.get(`/users/${this.user.id}`);
            this.user = res.data;
        }
    },
    
    persist: true
});