import { ref } from 'vue'
import type { Course } from '@/types'
import { useApi } from './useApi'

export function useCourses() {
  const courses = ref<Course[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { get } = useApi()

  async function fetchCourses(params?: Record<string, unknown>) {
    loading.value = true
    error.value = null
    try {
      courses.value = await get<Course[]>('/courses', params)
    } catch (e) {
      error.value = 'Не удалось загрузить курсы'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  async function fetchCourse(id: number) {
    loading.value = true
    error.value = null
    try {
      const course = await get<Course>(`/courses/${id}`)
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
