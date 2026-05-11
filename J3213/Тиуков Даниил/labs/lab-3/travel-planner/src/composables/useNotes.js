import { ref, watch } from 'vue'
import { TravelApi } from '@/api/travelApi.js'
import { useAuth } from './useAuth.js'

const notes = ref([])
const isLoading = ref(false)
let activeUserId = null

export function useNotes() {
  const { currentUser } = useAuth()

  async function loadNotes(force = false) {
    const userId = currentUser.value?.id || null
    if (!force && userId === activeUserId && notes.value.length) return notes.value
    activeUserId = userId
    if (!userId) {
      notes.value = []
      return notes.value
    }
    isLoading.value = true
    try {
      const items = await TravelApi.getNotes(userId)
      notes.value = [...items].sort((left, right) => new Date(right.date) - new Date(left.date))
    } catch (error) {
      console.error('useNotes: ошибка загрузки', error)
      notes.value = []
    } finally {
      isLoading.value = false
    }
    return notes.value
  }

  watch(
    () => currentUser.value?.id,
    () => {
      activeUserId = null
      loadNotes(true)
    }
  )

  async function addNote({ title, text }) {
    const user = currentUser.value
    if (!user?.id) return null
    const author = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Пользователь'
    const created = await TravelApi.addNote({
      userId: user.id,
      title,
      text,
      author,
      date: new Date().toISOString()
    })
    notes.value = [created, ...notes.value]
    return created
  }

  async function updateNote(noteId, patch) {
    const updated = await TravelApi.updateNote(noteId, { ...patch, date: new Date().toISOString() })
    notes.value = notes.value.map((note) => (note.id === noteId ? updated : note))
    return updated
  }

  async function removeNote(noteId) {
    await TravelApi.deleteNote(noteId)
    notes.value = notes.value.filter((note) => note.id !== noteId)
  }

  return { notes, isLoading, addNote, updateNote, removeNote, loadNotes }
}
