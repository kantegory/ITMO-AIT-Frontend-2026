import { defineStore } from 'pinia'
import { experimentsApi } from '@/api'

export const useExperimentsStore = defineStore('experiments', {
  state: () => ({
    experiments: []
  }),

  actions: {
    async loadExperiments() {
      const res = await experimentsApi.getAll()
      this.experiments = res.data
      return res
    },

    async createExperiment(data) {
      const res = await experimentsApi.create(data)
      await this.loadExperiments()
      return res
    },

    async updateExperiment(id, data) {
      const res = await experimentsApi.update(id, data)
      await this.loadExperiments()
      return res
    },

    async deleteExperiment(id) {
      await experimentsApi.remove(id)
      await this.loadExperiments()
    }
  }
})
