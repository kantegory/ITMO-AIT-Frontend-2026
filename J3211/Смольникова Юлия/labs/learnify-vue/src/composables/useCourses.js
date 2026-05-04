import { ref, computed } from 'vue'
import { useCoursesStore } from '@/stores/courses'

export function useCourses() {
  const coursesStore = useCoursesStore()

  const loading = ref(false)
  const error = ref(null)

  const courses = computed(() => coursesStore.allCourses)
  const currentCourse = computed(() => coursesStore.currentCourse)
  const isLoading = computed(() => coursesStore.loading || loading.value)
  const hasError = computed(() => coursesStore.error || error.value)

  async function loadCourses(filters = {}) {
    loading.value = true
    error.value = null

    try {
      await coursesStore.loadCourses(filters)
    } catch (err) {
      error.value = err.message || 'Ошибка загрузки курсов'
    } finally {
      loading.value = false
    }
  }

  async function loadCourse(id) {
    loading.value = true
    error.value = null

    try {
      await coursesStore.loadCourse(id)
    } catch (err) {
      error.value = err.message || 'Ошибка загрузки курса'
    } finally {
      loading.value = false
    }
  }

  async function createCourse(courseData) {
    loading.value = true
    error.value = null

    try {
      const course = await coursesStore.createCourse(courseData)
      return { success: true, course }
    } catch (err) {
      error.value = err.message || 'Ошибка создания курса'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateCourse(id, courseData) {
    loading.value = true
    error.value = null

    try {
      const course = await coursesStore.updateCourse(id, courseData)
      return { success: true, course }
    } catch (err) {
      error.value = err.message || 'Ошибка обновления курса'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function deleteCourse(id) {
    loading.value = true
    error.value = null

    try {
      await coursesStore.deleteCourse(id)
      return { success: true }
    } catch (err) {
      error.value = err.message || 'Ошибка удаления курса'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function getUserCourses(userId) {
    loading.value = true
    error.value = null

    try {
      const data = await coursesStore.getUserCourses(userId)
      return { success: true, data }
    } catch (err) {
      error.value = err.message || 'Ошибка загрузки курсов пользователя'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  function filterBySubject(subject) {
    if (!subject) return courses.value
    return courses.value.filter(c =>
      c.subject?.toLowerCase() === subject.toLowerCase()
    )
  }

  function filterByLevel(level) {
    if (!level) return courses.value
    return courses.value.filter(c =>
      c.level?.toLowerCase() === level.toLowerCase()
    )
  }

  function searchCourses(query) {
    if (!query) return courses.value
    const q = query.toLowerCase()
    return courses.value.filter(c =>
      c.title?.toLowerCase().includes(q) ||
      c.desc?.toLowerCase().includes(q) ||
      c.subject?.toLowerCase().includes(q)
    )
  }

  function getUniqueSubjects() {
    const subjects = courses.value
      .map(c => c.subject)
      .filter(Boolean)
    return [...new Set(subjects)]
  }

  function getUniqueLevels() {
    const levels = courses.value
      .map(c => c.level)
      .filter(Boolean)
    return [...new Set(levels)]
  }

  return {
    courses,
    currentCourse,
    loading,
    error,
    isLoading,
    hasError,

    loadCourses,
    loadCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    getUserCourses,

    filterBySubject,
    filterByLevel,
    searchCourses,
    getUniqueSubjects,
    getUniqueLevels
  }
}
