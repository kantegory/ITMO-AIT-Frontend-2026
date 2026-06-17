import { ref } from 'vue'

export function useNotes() {
  const notes = ref([])

  function addNote(title, text) {
    const t = String(title ?? '').trim()
    const x = String(text ?? '').trim()
    if (!t && !x) return
    notes.value.push({
      id: Date.now(),
      title: t || 'Без заголовка',
      text: x,
    })
  }

  return { notes, addNote }
}
