import {defineStore} from 'pinia'
import {ref} from 'vue'
import {coursesApi} from '@/api'

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchCourses(params = {}) {
    isLoading.value = true
    error.value = null
    try {
      const {data} = await coursesApi.getAll({isPublished: true, ...params})
      courses.value = data
    } catch (err) {
      error.value = 'Ошибка загрузки курсов'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  return {courses, isLoading, error, fetchCourses}
})
