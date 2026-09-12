import { ref } from 'vue'
import { useApi } from './useApi'

export function useLessons() {
  const { api } = useApi()
  const lessons = ref([])
  const loading = ref(false)

  async function fetchByUser(userId, role) {
    loading.value = true
    try {
      const { data } = await api.get('/lessons')
      if (role === 'student') {
        lessons.value = data.filter(l => l.status === 'free' || l.studentId == userId)
      } else {
        lessons.value = data.filter(l => l.instructorId == userId)
      }
    } finally {
      loading.value = false
    }
  }

  async function book(lessonId, studentId, studentName) {
    await api.patch(`/lessons/${lessonId}`, { status: 'booked', studentId, studentName })
  }

  async function complete(lessonId) {
    await api.patch(`/lessons/${lessonId}`, { status: 'completed' })
  }

  return { lessons, loading, fetchByUser, book, complete }
}