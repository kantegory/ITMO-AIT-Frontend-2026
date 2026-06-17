import { defineStore } from 'pinia'
import axios from 'axios'

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchNotes() {
      this.loading = true
      try {
        const response = await axios.get('https://api.example.com/notes')
        this.notes = response.data
      } catch (err) {
        this.error = 'Ошибка при загрузке заметок'
      } finally {
        this.loading = false
      }
    },

    addNote(note) {
      this.notes.push({
        id: Date.now(),
        ...note
      })
    },

    removeNote(id) {
      this.notes = this.notes.filter(note => note.id !== id)
    }
  }
})
