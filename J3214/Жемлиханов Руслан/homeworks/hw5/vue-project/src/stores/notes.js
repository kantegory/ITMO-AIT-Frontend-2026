import { defineStore } from 'pinia'

import { notesApi } from '@/api'

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [],
  }),
  actions: {
    async loadNotes() {
      this.notes = await notesApi.getAll()
    },
    async createNote(data) {
      await notesApi.createNote(data)
    },
  },
})
