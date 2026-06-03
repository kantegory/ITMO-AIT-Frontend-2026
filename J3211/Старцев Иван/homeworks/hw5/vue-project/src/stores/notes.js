import { defineStore } from 'pinia'
import { notesApi } from '@/api'

const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: []
  }),

  actions: {
    async loadNotes() {
      const response = await notesApi.getAll()

      this.notes = response.data

      return response
    },

    async createNote(data) {
      const response = await notesApi.createNote({...data, createdAt: new Date().toISOString()})

      this.notes = Array.isArray(this.notes) ? [...this.notes, response.data] : [response.data]

      return response
    }
  }
})

export default useNotesStore
