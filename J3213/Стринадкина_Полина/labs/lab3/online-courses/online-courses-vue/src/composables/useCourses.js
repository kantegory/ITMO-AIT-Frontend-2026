import { ref, onMounted } from 'vue'
import instance from '../api/instance'

export function useCourses() {
  const courses = ref([])
  const isLoading = ref(false)

  const fetchCourses = async () => {
    isLoading.value = true

    const response = await instance.get('/courses')
    courses.value = response.data

    isLoading.value = false
  }

  onMounted(fetchCourses)

  return {
    courses,
    isLoading,
    fetchCourses,
  }
}