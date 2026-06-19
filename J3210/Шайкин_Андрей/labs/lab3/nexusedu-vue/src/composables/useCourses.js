import { ref, computed } from 'vue'
import { api } from '@/api/instance'

export function useCourses() {
    const courses = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    const searchQuery = ref('')
    const selectedCategory = ref('')
    const maxPrice = ref(100000)
    const selectedLevels = ref([])

    const fetchCourses = async () => {
        isLoading.value = true
        error.value = null
        try {
            const response = await api.get('/courses')
            courses.value = response.data
        } catch (e) {
            error.value = 'Ошибка загрузки курсов. Сервер недоступен.'
            console.error(e)
        } finally {
            isLoading.value = false
        }
    }

    const filteredCourses = computed(() => {
        return courses.value.filter(course => {
            const q = searchQuery.value.toLowerCase()
            const matchSearch = course.title.toLowerCase().includes(q) || course.desc.toLowerCase().includes(q)
            const matchCategory = selectedCategory.value === '' || course.category === selectedCategory.value
            const matchPrice = course.price <= maxPrice.value
            const matchLevel = selectedLevels.value.length === 0 || selectedLevels.value.includes(course.level)

            return matchSearch && matchCategory && matchPrice && matchLevel
        })
    })

    return {
        courses,
        filteredCourses,
        isLoading,
        error,
        searchQuery,
        selectedCategory,
        maxPrice,
        selectedLevels,
        fetchCourses
    }
}