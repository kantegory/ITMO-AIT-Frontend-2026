import { ref } from 'vue'
import { defineStore } from 'pinia'
import { coursesApi, usersApi } from '@/api'

export const useCoursesStore = defineStore('courses', () => {
    const courses = ref([])
    const users = ref([])
    const isLoading = ref(false)
    const error = ref('')
    const isLoaded = ref(false)

    const setCourse = (course) => {
        const index = courses.value.findIndex((item) => item.id === course.id)
        if (index === -1) {
            courses.value.push(course)
            return
        }
        courses.value[index] = course
    }

    const loadCourses = async (force = false) => {
        if (isLoading.value) {
            return
        }

        if (!force && isLoaded.value) {
            return
        }

        isLoading.value = true
        error.value = ''

        try {
            const [coursesData, usersData] = await Promise.all([
                coursesApi.getAll(),
                usersApi.getAll(),
            ])

            courses.value = coursesData
            users.value = usersData
            isLoaded.value = true
        } catch {
            error.value = 'Не удалось загрузить курсы.'
            throw new Error(error.value)
        } finally {
            isLoading.value = false
        }
    }

    const createCourse = async (payload) => {
        const createdCourse = await coursesApi.create(payload)
        setCourse(createdCourse)
        return createdCourse
    }

    const updateCourse = async (id, payload) => {
        const updatedCourse = await coursesApi.update(id, payload)
        setCourse(updatedCourse)
        return updatedCourse
    }

    return {
        courses,
        users,
        isLoading,
        error,
        isLoaded,
        loadCourses,
        createCourse,
        updateCourse,
    }
})
