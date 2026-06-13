import { defineStore } from 'pinia'
import { getWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace } from '@/api/workspaces'

export const useWorkspacesStore = defineStore('workspaces', {
  state: () => ({
    items: [],
    isLoading: false,
    error: null
  }),

  getters: {
    totalCount: (s) => s.items.length,
    activeCount: (s) => s.items.filter(w => w.type !== 'other').length
  },

  actions: {
    async load(params = {}) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await getWorkspaces(params)
        this.items = data
      } catch (e) {
        this.error = 'Ошибка загрузки'
      } finally {
        this.isLoading = false
      }
    },

    async add(payload) {
      const { data } = await createWorkspace(payload)
      this.items.push(data)
      return data
    },

    async update(id, payload) {
      const { data } = await updateWorkspace(id, payload)
      const idx = this.items.findIndex(w => w.id === id)
      if (idx !== -1) this.items[idx] = data
    },

    async remove(id) {
      await deleteWorkspace(id)
      this.items = this.items.filter(w => w.id !== id)
    }
  }
})