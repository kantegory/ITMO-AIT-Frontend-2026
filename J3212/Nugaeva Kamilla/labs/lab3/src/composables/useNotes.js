import { onMounted, ref } from 'vue'
import { notesApi } from '../api/index.js'

export function useNotes() {
  const notes = ref('')
  const isLoading = ref(false)
  const message = ref('')
  const error = ref('')

  async function loadNotes() {
    isLoading.value = true
    error.value = ''

    try {
      const response = await notesApi.getAll()

      if (Array.isArray(response.data) && response.data.length > 0) {
        notes.value = response.data[0].text || ''
      } else {
        notes.value = getLocalNotes()
      }
    } catch {
      notes.value = getLocalNotes()
    } finally {
      isLoading.value = false
    }
  }

  function saveNotes() {
    localStorage.setItem('travel_notes', notes.value)
    message.value = 'Заметки сохранены.'
  }

  function clearNotes() {
    notes.value = ''
    localStorage.removeItem('travel_notes')
    message.value = 'Заметки очищены.'
  }

  onMounted(loadNotes)

  return {
    notes,
    isLoading,
    message,
    error,
    loadNotes,
    saveNotes,
    clearNotes,
  }
}

function getLocalNotes() {
  return localStorage.getItem('travel_notes') || ''
}