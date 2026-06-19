import { defineStore } from 'pinia'
import { coursesApi }  from '@/api'

const useCoursesStore = defineStore('courses', {
  state: () => ({
    courses: [],
    loading: false
  }),

  actions: {
    async loadCourses() {
      this.loading = true
      try {
        const res    = await coursesApi.getAll()
        // Только опубликованные
        this.courses = res.data.filter(c => c.status === 'published' || !c.status)
      } finally { this.loading = false }
    },

    async createCourse(data) {
      const res = await coursesApi.create(data)
      this.courses.push(res.data)
      return res.data
    },

    async updateCourse(id, data) {
      await coursesApi.update(id, data)
      const idx = this.courses.findIndex(c => String(c.id) === String(id))
      if (idx !== -1) Object.assign(this.courses[idx], data)
    }
  }
})

export default useCoursesStore
