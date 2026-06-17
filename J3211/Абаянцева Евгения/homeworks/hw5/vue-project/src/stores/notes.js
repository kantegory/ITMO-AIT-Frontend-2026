import { defineStore } from 'pinia'
import { notesApi } from '@/api'

export const useNotesStore = defineStore('notes', {
    state: () => ({
        notes: []
	}),
	actions: {
		async loadNotes() {
		try {
			const response = await notesApi.getAll()
			this.notes = response.data
			return response
		} catch (error) {
			console.error('Ошибка загрузки заметок:', error)
			throw error
		}
	},
    async createNote(data) {
		try {
			const response = await notesApi.createNote(data)
        
			if (response.data) {
				this.notes.push(response.data)
			}
			return response
		} catch (error) {
			console.error('Ошибка создания заметки:', error)
			throw error
		}
      }
    },

    persist: true
})