import { defineStore } from 'pinia'
import { modelsApi } from '@/api'

export const useModelsStore = defineStore('models', {
  state: () => ({
    models: []
  }),

  actions: {
    async loadModels() {
      const res = await modelsApi.getAll()
      this.models = res.data
      return res
    },

    async createModel(data) {
      const res = await modelsApi.create(data)
      await this.loadModels()
      return res
    },

    async updateModel(id, data) {
      const res = await modelsApi.update(id, data)
      await this.loadModels()
      return res
    }
  }
})
