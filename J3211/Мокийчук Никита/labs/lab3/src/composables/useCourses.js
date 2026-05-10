import { ref } from 'vue'
import { AppAPI } from '../api/api'

export function useCourses() {
  const courses = ref([])
  const loading = ref(false)
  const error = ref(null)

  const loadCourses = async () => {
    loading.value = true
    error.value = null
    try {
      courses.value = await AppAPI.getCourses()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const sortCourses = (items, mode) => {
    const list = [...items]
    switch (mode) {
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating)
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price)
      case 'new':
        return list.sort((a, b) => Number(b.isNew) - Number(a.isNew))
      case 'popular':
      default:
        return list.sort((a, b) => b.students - a.students)
    }
  }

  const filterCourses = (items, { query = '', subjects = [], levels = [], maxPrice = 10000 } = {}) => {
    const q = query.toLowerCase().trim()
    return items.filter((course) => {
      const matchTitle = course.title.toLowerCase().includes(q)
      const matchSubject = subjects.length === 0 || subjects.includes(course.subject)
      const matchLevel = levels.length === 0 || levels.includes(course.level)
      const matchPrice = Number(course.price) <= Number(maxPrice)
      return matchTitle && matchSubject && matchLevel && matchPrice
    })
  }

  return {
    courses,
    loading,
    error,
    loadCourses,
    sortCourses,
    filterCourses
  }
}
