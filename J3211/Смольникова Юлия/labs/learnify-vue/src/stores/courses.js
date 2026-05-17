import { defineStore } from 'pinia'
import { coursesApi, enrollmentsApi } from '@/api'

export const useCoursesStore = defineStore('courses', {
  state: () => ({
    allCourses: [],
    currentCourse: null,
    loading: false,
    error: null
  }),

  actions: {
    async loadCourses(filters = {}) {
      this.loading = true
      this.error = null
      try {
        const result = await coursesApi.getAll(1, 1000, filters)
        this.allCourses = result.courses
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async loadCourse(id) {
      this.loading = true
      this.error = null
      try {
        this.currentCourse = await coursesApi.getById(id)
        return this.currentCourse
      } catch (err) {
        this.error = err.message
        this.currentCourse = null
        return null
      } finally {
        this.loading = false
      }
    },

    async createCourse(data) {
      return await coursesApi.create(data)
    },

    async updateCourse(id, data) {
      return await coursesApi.update(id, data)
    },

    async deleteCourse(id) {
      await enrollmentsApi.deleteByCourse(id)
      await coursesApi.delete(id)
    },

    async checkEnrollment(userId, courseId) {
      return await enrollmentsApi.check(userId, courseId)
    },

    async enroll(data) {
      return await enrollmentsApi.enroll(data)
    },

    async getUserEnrollments(userId) {
      if (userId) {
        return await enrollmentsApi.getByUser(userId)
      }
      return await enrollmentsApi.getAll()
    },

    async getAllEnrollments() {
      return await enrollmentsApi.getAll()
    },

    async getUserCourses(userId) {
      const [enrollments, allCourses] = await Promise.all([
        enrollmentsApi.getByUser(userId),
        coursesApi.getAll(1, 1000, {})
      ])
      const courseMap = {}
      allCourses.courses.forEach(c => { courseMap[c.id] = c })

      const enrolled = enrollments.map(e => ({
        ...e,
        course: courseMap[e.courseId] || null
      }))

      const created = allCourses.courses.filter(c => c.userId === userId) || []

      return { enrolled, created }
    }
  }
})