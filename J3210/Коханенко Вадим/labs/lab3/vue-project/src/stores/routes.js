import { defineStore } from 'pinia'
import { routesApi } from '@/api'

export const useRoutesStore = defineStore('routes', {
  state: () => ({
    routes: [],
    isLoading: false
  }),
  
  getters: {
    userRoutes: (state) => (userId) => state.routes.filter(route => route.userId === userId),
    routesCount: (state) => (userId) => state.routes.filter(route => route.userId === userId).length
  },
  
  actions: {
    async loadRoutes() {
      this.isLoading = true
      try {
        const response = await routesApi.getAll()
        this.routes = response.data
        return response
      } finally {
        this.isLoading = false
      }
    },
    
    async saveRoute(data) {
      const response = await routesApi.create(data)
      this.routes.push(response.data)
      return response
    },
    
    async deleteRoute(id) {
      await routesApi.delete(id)
      this.routes = this.routes.filter(r => r.id !== id)
    }
  }
})