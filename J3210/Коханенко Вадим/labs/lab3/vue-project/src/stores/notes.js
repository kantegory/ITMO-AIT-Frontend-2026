import { defineStore } from 'pinia'
import { notesApi } from '@/api'

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [],
    isLoading: false
  }),
  
  getters: {
    userNotes: (state) => (userId) => state.notes.filter(note => note.userId === userId),
    notesCount: (state) => (userId) => state.notes.filter(note => note.userId === userId).length
  },
  
  actions: {
    async loadNotes() {
      this.isLoading = true
      try {
        const response = await notesApi.getAll()
        this.notes = response.data
        return response
      } finally {
        this.isLoading = false
      }
    },
    
    async createNote(data) {
      const response = await notesApi.create(data)
      this.notes.push(response.data)
      return response
    },
    
    async updateNote(id, data) {
      const response = await notesApi.update(id, data)
      const index = this.notes.findIndex(n => n.id === id)
      if (index !== -1) {
        this.notes[index] = response.data
      }
      return response
    },
    
    async deleteNote(id) {
      await notesApi.delete(id)
      this.notes = this.notes.filter(n => n.id !== id)
    }
  }
})