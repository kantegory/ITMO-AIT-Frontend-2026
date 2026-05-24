import { ref } from 'vue'
import { useApi } from './useApi'

export function useCourses() {
  const courses = ref([])
  const loading = ref(false)
  const error = ref(null)
  const { get } = useApi()

  async function fetchCourses(params) {
    loading.value = true
    error.value = null
    try {
      courses.value = await get('/courses', params)
    } catch (e) {
      error.value = 'Не удалось загрузить курсы'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  async function fetchCourse(id) {
    loading.value = true
    error.value = null
    try {
      const course = await get(`/courses/${id}`)
      return course
    } catch (e) {
      error.value = 'Курс не найден'
      console.error(e)
      return null
    } finally {
      loading.value = false
    }
  }

  return { courses, loading, error, fetchCourses, fetchCourse }
}
