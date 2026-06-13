import { ref } from 'vue'

const STORAGE_KEY = 'travelNotes'

export function useTravelNotes() {
  const notes = ref(localStorage.getItem(STORAGE_KEY) || '')
  const saved = ref(false)

  function saveNotes() {
    localStorage.setItem(STORAGE_KEY, notes.value.trim())
    saved.value = true
    window.setTimeout(() => { saved.value = false }, 1500)
  }

  return { notes, saved, saveNotes }
}
