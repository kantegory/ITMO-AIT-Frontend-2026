import { computed } from 'vue'
import { useCoursesStore } from '@/stores/courses'
import { useSessionStore } from '@/stores/session'

export const useCourses = () => {
    const coursesStore = useCoursesStore()
    const sessionStore = useSessionStore()

    const currentUser = computed(() => sessionStore.currentUser)

    const usersById = computed(() => {
        const map = new Map()
        coursesStore.users.forEach((user) => {map.set(user.id, user)})
        if (currentUser.value) {map.set(currentUser.value.id, currentUser.value)}
        return map
    })

    const studentsCountByCourseId = computed(() => {
        const map = new Map()
        for (const user of usersById.value.values()) {
            user.learningCourseIds.forEach((courseId) => {map.set(courseId, (map.get(courseId) || 0) + 1)})
        }
        return map
    })

    const authorsByCourseId = computed(() => {
        const map = new Map()
        coursesStore.courses.forEach((course) => {map.set(course.id, usersById.value.get(course.userId)?.name || 'Неизвестный автор')})
        return map
    })

    const catalogCourses = computed(() =>
        coursesStore.courses.map((course) => ({
            ...course,
            rating: course.comments.length
                ? course.comments.reduce((sum, comment) => sum + comment.rating, 0) / course.comments.length
                : 0,
            studentsCount: studentsCountByCourseId.value.get(course.id) || 0,
            authorName: authorsByCourseId.value.get(course.id) || 'Неизвестный автор',
        })),
    )

    const createdIds = computed(() => new Set(currentUser.value?.createdCourseIds || []))

    const learningIds = computed(() => new Set(currentUser.value?.learningCourseIds || []))

    const myCourses = computed(() =>
        catalogCourses.value.filter((course) => createdIds.value.has(course.id)),
    )

    const myLearningCourses = computed(() =>
        catalogCourses.value.filter((course) => learningIds.value.has(course.id)),
    )

    const getCourseById = (id) =>
        catalogCourses.value.find((course) => course.id === Number(id)) || null

    const isMyCourse = (courseId) => createdIds.value.has(Number(courseId))
    const isLearningCourse = (courseId) => learningIds.value.has(Number(courseId))

    return {
        usersById,
        studentsCountByCourseId,
        authorsByCourseId,
        catalogCourses,
        myCourses,
        myLearningCourses,
        getCourseById,
        isMyCourse,
        isLearningCourse,
    }
}
