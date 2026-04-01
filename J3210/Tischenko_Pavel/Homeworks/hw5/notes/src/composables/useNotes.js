import { ref, watch } from 'vue'

const STORAGE_KEY = 'hw5-notes'

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStorage(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function useNotes() {
  const notes = ref(readStorage())

  watch(
    notes,
    (value) => {
      writeStorage(value)
    },
    { deep: true }
  )

  function addNote(title, text) {
    const trimmedTitle = title.trim() || 'Без названия'
    const trimmedText = text.trim()
    if (!trimmedText) return false
    notes.value.unshift({
      id: String(Date.now()),
      title: trimmedTitle,
      text: trimmedText,
      createdAt: new Date().toISOString()
    })
    return true
  }

  function removeNote(id) {
    notes.value = notes.value.filter((n) => n.id !== id)
  }

  return { notes, addNote, removeNote }
}
