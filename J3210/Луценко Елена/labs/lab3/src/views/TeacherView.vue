<script setup>
import {ref, onMounted, watch} from 'vue'
import {coursesApi} from '@/api'
import {useAuth} from '@/composables/useAuth'

import MainLayout from '@/layouts/MainLayout.vue'
import TeacherCourseRow from '@/components/teacher/TeacherCourseRow.vue'

import CreateCourseModal from '@/components/modals/CreateCourseModal.vue'
import AddLessonModal from '@/components/modals/AddLessonModal.vue'
import AddMaterialModal from '@/components/modals/AddMaterialModal.vue'

const {user} = useAuth()
const fullUser = ref(null)
const teacherCourses = ref([])

const loadData = async () => {
    if (!user.value || !user.value.id) {
        return
    }

    const [uRes, cRes] = await Promise.all([
        coursesApi.getUser(user.value.id),
        coursesApi.getAll()
    ])
    fullUser.value = uRes.data
    teacherCourses.value = cRes.data.filter(course => fullUser.value.courses.includes(course.id))
}

onMounted(loadData)

watch(() => user.value, (newUser) => {
    if (newUser && !fullUser.value) {
        loadData()
    }
}, { immediate: true })

const handleDelete = async (course) => {
    if (!confirm(`Вы уверены, что хотите полностью удалить курс "${course.title}"?`)) {
        return
    }

    try {
        await coursesApi.deleteCourse(course.id)

        const userRes = await coursesApi.getUser(user.value.id)
        const currentUserData = userRes.data

        const updatedCourses = currentUserData.courses.filter(id => id !== course.id)

        await coursesApi.updateUser(user.value.id, {
            courses: updatedCourses
        })

        alert(`Курс "${course.title}" успешно удален`)
        await loadData()

    } catch (error) {
        console.error("Ошибка при удалении:", error)
        alert("Произошла ошибка при попытке удалить курс")
    }
}
</script>

<template>
    <MainLayout>
        <main class="container py-5" v-if="fullUser">
            <div class="card border-0 p-4 mb-5 shadow-sm">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h1 class="fw-bold mb-0 h4">Здравствуйте, <span class="text-primary">{{
                                fullUser.name
                            }}</span></h1>
                    </div>
                    <div class="col-md-4 text-md-end mt-3 mt-md-0">
                        <button class="btn btn-success me-2" data-bs-toggle="modal"
                                data-bs-target="#createCourseModal">
                            <svg class="icon">
                                <use xlink:href="/sprite.svg#icon-plus"></use>
                            </svg>
                            Создать курс
                        </button>
                    </div>
                </div>
            </div>

            <div class="text-center mb-4 px-1">
                <h2 class="fw-bold mb-3 h3">Ваши активные курсы</h2>
                <div class="d-flex justify-content-center gap-3">
                    <button class="btn btn-primary px-4 py-2" data-bs-toggle="modal"
                            data-bs-target="#addLessonModal">
                        <svg class="icon">
                            <use xlink:href="/sprite.svg#icon-plus"></use>
                        </svg>
                        Добавить урок
                    </button>
                    <button class="btn btn-primary px-4 py-2" data-bs-toggle="modal"
                            data-bs-target="#addMaterialModal">
                        <svg class="icon">
                            <use xlink:href="/sprite.svg#icon-plus"></use>
                        </svg>
                        Добавить материал
                    </button>
                </div>
            </div>

            <div class="card overflow-hidden border-0 shadow-sm">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                        <tr class="align-middle">
                            <th class="ps-4 py-3">Название курса</th>
                            <th>Студентов</th>
                            <th>Категория</th>
                            <th class="pe-4">Статус</th>
                        </tr>
                        </thead>
                        <tbody>
                        <TeacherCourseRow v-for="course in teacherCourses" :key="course.id"
                                          :course="course"
                                          @delete="handleDelete"/>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>

        <CreateCourseModal :userId="user.id" :userCourses="fullUser?.courses"/>
        <AddLessonModal :courses="teacherCourses"/>
        <AddMaterialModal :courses="teacherCourses"/>
    </MainLayout>
</template>
