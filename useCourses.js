import { ref, computed } from 'vue'
import { getCourses } from '../api/api'


export function useCourses() {
  const courses = ref([])
  const loading = ref(false)
  const error = ref(null)

  const languageFilter = ref('')
  const levelFilter = ref('')
  const priceFilter = ref('')

  const formatPrice = (price) => {
    if (Number(price) === 0) {
      return 'Бесплатно'
    }

    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
  }

  const loadCourses = async () => {
    try {
      loading.value = true
      error.value = null
      courses.value = await getCourses()
    } catch (err) {
      error.value = 'Ошибка загрузки курсов'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const filteredCourses = computed(() => {
    return courses.value.filter((course) => {
      const matchLanguage = languageFilter.value
        ? course.category === languageFilter.value
        : true

      const matchLevel = levelFilter.value
        ? course.level === levelFilter.value
        : true

      const matchPrice = priceFilter.value
        ? Number(course.price) <= Number(priceFilter.value)
        : true

      return matchLanguage && matchLevel && matchPrice
    })
  })

  return {
    courses,
    loading,
    error,
    languageFilter,
    levelFilter,
    priceFilter,
    filteredCourses,
    formatPrice,
    loadCourses,
  }
}