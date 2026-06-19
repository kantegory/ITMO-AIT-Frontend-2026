// Composable для фильтрации курсов - логика из search.html вынесена в отдельный файл.
// Используется в CoursesPage, устраняя дублирование.
import { ref, computed } from 'vue'

export function useFilters(courses) {
  const searchQuery    = ref('')
  const checkedCats    = ref([])
  const selectedLevel  = ref('')
  const selectedPrice  = ref('')

  const categories = ['Разработка', 'Дизайн', 'Данные', 'Бизнес']
  const levels     = ['Начинающий', 'Средний', 'Продвинутый']

  // computed пересчитывается при изменении любого фильтра или массива courses
  const filteredCourses = computed(() => {
    return courses.value.filter(course => {
      const matchCat   = checkedCats.value.length === 0 || checkedCats.value.includes(course.category)
      const matchLevel = !selectedLevel.value || course.level === selectedLevel.value
      const matchPrice = !selectedPrice.value
        || (selectedPrice.value === 'free' && course.price === 0)
        || (selectedPrice.value === 'paid' && course.price > 0)
      const matchQuery = !searchQuery.value
        || course.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      return matchCat && matchLevel && matchPrice && matchQuery
    })
  })

  function resetFilters() {
    searchQuery.value   = ''
    checkedCats.value   = []
    selectedLevel.value = ''
    selectedPrice.value = ''
  }

  return {
    searchQuery, checkedCats, selectedLevel, selectedPrice,
    filteredCourses, categories, levels, resetFilters
  }
}
