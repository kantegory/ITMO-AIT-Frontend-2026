<script setup>
import { computed, onMounted, ref } from 'vue'
import AppAlert from '@/components/AppAlert.vue'
import CreateCourse from '@/components/createCourse.vue'
import MyCourseCard from '@/components/MyCourseCard.vue'
import MyCoursesStats from '@/components/myCoursesStats.vue'
import { useAlert } from '@/composables/useAlert'
import { useCourses } from '@/composables/useCourses'
import { usePageMeta } from '@/composables/usePageMeta'
import { useCoursesStore } from '@/stores/courses'

const coursesStore = useCoursesStore()
const { myCourses } = useCourses()
const { alert: pageAlert, showAlert: showMessage, hideAlert: hideMessage } = useAlert()
const { setPageMeta } = usePageMeta()

const createCourseModal = ref(null)

const studentsCount = computed(() =>
    myCourses.value.reduce((sum, course) => sum + course.studentsCount, 0),
)

const revenue = computed(() =>
    myCourses.value.reduce((sum, course) => sum + course.studentsCount * course.price, 0),
)

const stats = computed(() => [
    {
        title: 'Создано курсов',
        value: myCourses.value.length,
    },
    {
        title: 'Учеников на курсах',
        value: studentsCount.value,
    },
    {
        title: 'Выручка',
        value: `${revenue.value} ₽`,
    },
])

const openCreateModal = () => {
    hideMessage()
    createCourseModal.value?.openCreate()
}

const openEditModal = (course) => {
    hideMessage()
    createCourseModal.value?.openEdit(course)
}

onMounted(async () => {
    setPageMeta('Мои курсы', 'Управляйте созданными курсами, следите за количеством учеников и выручкой')

    try {
        await coursesStore.loadCourses()
    } catch {
        showMessage('danger', coursesStore.error || 'Не удалось загрузить мои курсы.')
    }
})
</script>

<template>
    <main class="container pt-2 pb-4">
        <AppAlert
            :visible="pageAlert.visible"
            :type="pageAlert.type"
            :text="pageAlert.text"
            class="mb-3"
        />

        <div>
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <h1 class="h3 mb-0">Мои курсы</h1>

                <button
                    type="button"
                    class="btn btn-primary"
                    @click="openCreateModal"
                >
                    <svg class="default_svg" aria-hidden="true">
                        <use href="/sprites.svg#plusCircle"></use>
                    </svg>
                    Создать курс
                </button>
            </div>

            <div class="row g-3 mb-3">
                <div
                    v-for="stat in stats"
                    :key="stat.title"
                    class="col-12 col-md-4"
                >
                    <MyCoursesStats
                        :title="stat.title"
                        :value="stat.value"
                    />
                </div>
            </div>

            <AppAlert
                :visible="!myCourses.length"
                text="Пока нет созданных курсов."
            />

            <ul class="row g-3 list-unstyled">
                <li
                    v-for="course in myCourses"
                    :key="course.id"
                    class="col-12 col-sm-6 col-lg-4 col-xl-3"
                >
                    <MyCourseCard :course="course" @edit="openEditModal" />
                </li>
            </ul>
        </div>
    </main>

    <CreateCourse
        ref="createCourseModal"
        @create="showMessage('success', $event)"
        @err="showMessage('danger', $event)"
    />
</template>
