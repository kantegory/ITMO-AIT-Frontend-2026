import { defineStore } from 'pinia'
import { destinationsApi } from '@/api'

export const useDestinationsStore = defineStore('destinations', {
  state: () => ({
    destinations: [],
    isLoading: false
  }),
  
  getters: {
    getDestinationById: (state) => (id) => {
      return state.destinations.find(d => d.id === parseInt(id))
    }
  },
  
  actions: {
    async loadDestinations() {
      this.isLoading = true
      try {
        const response = await destinationsApi.getAll()
        this.destinations = response.data
        return response
      } finally {
        this.isLoading = false
      }
    },
    
    async loadDestinationById(id) {
      this.isLoading = true
      try {
        const response = await destinationsApi.getOne(id)
        return response.data
      } finally {
        this.isLoading = false
      }
    }
  }
})