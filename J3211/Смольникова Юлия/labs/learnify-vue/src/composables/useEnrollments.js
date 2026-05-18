import { ref, computed } from 'vue'
import { useCoursesStore } from '@/stores/courses'

export function useEnrollments() {
  const coursesStore = useCoursesStore()

  const loading = ref(false)
  const error = ref(null)
  const enrollments = ref([])

  async function fetchUserEnrollments(userId) {
    loading.value = true
    error.value = null

    try {
      const data = await coursesStore.getUserEnrollments(userId)
      enrollments.value = data
      return { success: true, data }
    } catch (err) {
      error.value = err.message || 'Ошибка загрузки записей'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function checkEnrollment(userId, courseId) {
    try {
      const isEnrolled = await coursesStore.checkEnrollment(userId, courseId)
      return isEnrolled
    } catch (err) {
      console.error('Ошибка проверки записи:', err)
      return false
    }
  }

  async function enrollToCourse(enrollmentData) {
    loading.value = true
    error.value = null

    try {
      const result = await coursesStore.enroll({
        ...enrollmentData,
        progress: 0,
        completed: false,
        enrolledAt: new Date().toISOString()
      })
      return { success: true, data: result }
    } catch (err) {
      error.value = err.message || 'Ошибка записи на курс'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function quickEnroll(userId, courseId) {
    const alreadyEnrolled = await checkEnrollment(userId, courseId)
    if (alreadyEnrolled) {
      return { success: false, error: 'Вы уже записаны на этот курс' }
    }

    return enrollToCourse({ userId, courseId })
  }

  const completedPercentage = computed(() => {
    if (enrollments.value.length === 0) return 0
    const completed = enrollments.value.filter(e => e.completed).length
    return Math.round((completed / enrollments.value.length) * 100)
  })

  const activeCoursesCount = computed(() => {
    return enrollments.value.filter(e => !e.completed).length
  })

  const completedCoursesCount = computed(() => {
    return enrollments.value.filter(e => e.completed).length
  })

  const learningStats = computed(() => ({
    total: enrollments.value.length,
    active: activeCoursesCount.value,
    completed: completedCoursesCount.value,
    percentage: completedPercentage.value
  }))

  function reset() {
    enrollments.value = []
    loading.value = false
    error.value = null
  }

  return {
    enrollments,
    loading,
    error,
    completedPercentage,
    activeCoursesCount,
    completedCoursesCount,
    learningStats,

    fetchUserEnrollments,
    checkEnrollment,
    enrollToCourse,
    quickEnroll,
    reset
  }
}