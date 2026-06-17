<script setup>
import {computed} from 'vue'
import {useRouter} from 'vue-router'
import {coursesApi} from '@/api/index.js'
import {useAuth} from '@/composables/useAuth.js'

const props = defineProps(['course', 'fullUser'])
const emit = defineEmits(['enrolled'])
const router = useRouter()
const {user} = useAuth()

const isEnrolled = computed(() => {
    return props.fullUser?.courses?.includes(props.course?.id)
})

const closeModal = () => {
    const modalEl = document.getElementById('courseInfoModal')
    if (window.bootstrap) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalEl)
        if (modalInstance) modalInstance.hide()
    }
}

const goToUrl = (path) => {
    closeModal()
    router.push(path)
}

const handleEnroll = async () => {
    if (!user.value) {
        alert("Чтобы записаться на курс, необходимо войти в систему")
        goToUrl('/login')
        return
    }

    if (confirm(`Записаться на курс "${props.course.title}?"`)) {
        try {
            const updatedCourses = [...props.fullUser.courses, props.course.id]
            const updatedProgress = {...props.fullUser.progress, [props.course.id]: "0%"}

            await coursesApi.updateUser(user.value.id, {
                courses: updatedCourses,
                progress: updatedProgress
            })

            const newStudentsCount = (props.course.studentsCount || 0) + 1

            await coursesApi.updateCourse(props.course.id, {
                studentsCount: newStudentsCount
            })

            alert("Поздравляем! Вы успешно записаны на курс")

            closeModal()
            router.push('/profile')

            emit('enrolled')
        } catch (e) {
            alert("Ошибка при записи")
            console.error(e)
        }
    }
}
</script>

<template>
    <div class="modal fade" id="courseInfoModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div v-if="course" class="modal-content border-0 shadow">
                <div class="modal-header bg-dark text-white">
                    <h3 class="modal-title fw-bold h5">{{ course.title }}</h3>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                </div>
                <div class="modal-body p-4">
                    <div class="d-flex justify-content-between mb-3">
            <span class="badge bg-primary-subtle text-primary border border-primary-subtle">{{
                    course.level
                }}</span>
                        <span class="text-muted small">{{ course.category }}</span>
                    </div>
                    <p class="mb-4">{{ course.description }}</p>

                    <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                        <h4 class="fw-bold text-primary mb-0">{{ course.price }} ₽</h4>

                        <div class="d-flex gap-2">
                            <template v-if="user?.role === 'teacher'">
                                <button @click="goToUrl(`/course/${course.id}`)"
                                        class="btn btn-outline-primary">
                                    Просмотр материалов
                                </button>
                            </template>

                            <template v-else-if="user && isEnrolled">
                                <button @click="goToUrl(`/course/${course.id}`)"
                                        class="btn btn-success">
                                    Перейти к урокам
                                </button>
                            </template>

                            <template v-else>
                                <button @click="handleEnroll" class="btn btn-primary">
                                    Записаться на курс
                                </button>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
