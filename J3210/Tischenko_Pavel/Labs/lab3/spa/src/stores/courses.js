import { defineStore } from 'pinia'
import { coursesApi } from '../api'

const useCoursesStore = defineStore('courses', {
  state: () => ({
    courses: [],
    selectedCourse: null,
    loading: false,
    error: ''
  }),
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'lab3-courses',
        storage: localStorage,
        paths: ['courses']
      }
    ]
  },
  actions: {
    async loadCourses() {
      this.loading = true
      this.error = ''
      try {
        const response = await coursesApi.getAll()
        this.courses = Array.isArray(response.data) ? response.data : []
        return response
      } catch (error) {
        this.error = error?.message || 'Не удалось загрузить курсы.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async loadCourseById(id) {
      this.loading = true
      this.error = ''
      try {
        const response = await coursesApi.getOne(id)
        this.selectedCourse = response.data || null
        return response
      } catch (error) {
        this.error = error?.message || 'Не удалось загрузить курс.'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})

export default useCoursesStore
