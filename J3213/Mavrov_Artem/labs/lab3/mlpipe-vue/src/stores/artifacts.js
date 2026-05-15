import { defineStore } from 'pinia'
import { artifactsApi } from '@/api'

export const useArtifactsStore = defineStore('artifacts', {
  state: () => ({
    artifacts: []
  }),

  actions: {
    async loadArtifacts() {
      const res = await artifactsApi.getAll()
      this.artifacts = res.data
      return res
    },

    async createArtifact(data) {
      const res = await artifactsApi.create(data)
      await this.loadArtifacts()
      return res
    },

    async deleteArtifact(id) {
      await artifactsApi.remove(id)
      await this.loadArtifacts()
    }
  }
})
