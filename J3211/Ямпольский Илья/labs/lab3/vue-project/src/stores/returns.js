import { defineStore } from 'pinia'
import { returnsApi } from '@/api'

export const useReturnsStore = defineStore('returns', {
  state: () => ({
    returns: []
  }),

  persist: true,

  actions: {
    async loadReturns(userId) {
      const response = await returnsApi.getAll({ userId })
      this.returns = response.data
      return response
    },
    async createReturn(data) {
      const response = await returnsApi.create(data)
      this.returns.push(response.data)
      return response
    }
  }
})
