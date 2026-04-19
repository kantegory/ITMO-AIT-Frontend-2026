import { defineStore } from 'pinia'
import workspacesApi from '@/api/workspaces'

export const useWorkspacesStore = defineStore('workspaces', {
  state: () => ({
    items: [],
    isLoading: false,
    error: null
  }),

  getters: {
    totalCount: (state) => state.items.length,
    activeCount: (state) =>
      state.items.filter(item => item.status === 'active').length
  },

  actions: {
    async loadWorkspaces(params = {}) {
      this.isLoading = true
      this.error = null

      try {
        const { data } = await workspacesApi.getAll(params)
        this.items = data
      } catch (error) {
        this.error = 'Не удалось загрузить workspace'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    async addWorkspace(payload) {
      this.isLoading = true
      this.error = null

      try {
        await workspacesApi.createWorkspace({
          ...payload,
          createdAt: new Date().toISOString()
        })
        await this.loadWorkspaces()
      } catch (error) {
        this.error = 'Не удалось создать workspace'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    async editWorkspace(id, payload) {
      this.isLoading = true
      this.error = null

      try {
        await workspacesApi.updateWorkspace(id, payload)
        await this.loadWorkspaces()
      } catch (error) {
        this.error = 'Не удалось обновить workspace'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    async removeWorkspace(id) {
      this.isLoading = true
      this.error = null

      try {
        await workspacesApi.deleteWorkspace(id)
        await this.loadWorkspaces()
      } catch (error) {
        this.error = 'Не удалось удалить workspace'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    }
  }
})