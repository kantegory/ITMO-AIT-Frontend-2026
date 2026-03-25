<script setup>
import { computed, onMounted, ref } from 'vue'
import AppAlert from '@/components/AppAlert.vue'
import LearningCourseCard from '@/components/LearningCourseCard.vue'
import { useCourses } from '@/composables/useCourses'
import { usePageMeta } from '@/composables/usePageMeta'
import { useCoursesStore } from '@/stores/courses'

const coursesStore = useCoursesStore()
const { myLearningCourses } = useCourses()
const { setPageMeta } = usePageMeta()

const searchInput = ref('')

const filteredCourses = computed(() => {
    const query = searchInput.value.trim().toLowerCase()

    return myLearningCourses.value.filter(
        (course) => !query || course.title.toLowerCase().includes(query),
    )
})

const emptyStateVisible = computed(() =>
    Boolean(coursesStore.error) || (!coursesStore.isLoading && filteredCourses.value.length === 0),
)

const emptyStateText = computed(() =>
    coursesStore.error || 'Курсы не найдены.',
)

const emptyStateType = computed(() =>
    coursesStore.error ? 'danger' : 'secondary',
)

onMounted(async () => {
    setPageMeta('Моё обучение', 'Ваши активные курсы.')

    await coursesStore.loadCourses()
})
</script>

<template>
    <main class="container pt-2 pb-4">
        <h1 class="h3 mb-3">Моё обучение</h1>

        <form id="searchForm" role="search" class="input-group mb-3" @submit.prevent>
            <label for="searchInput" class="visually-hidden">Поиск курса по названию</label>
            <input
                id="searchInput"
                v-model="searchInput"
                type="search"
                class="form-control"
                placeholder="Введите название курса"
            >
        </form>

        <AppAlert
            :visible="emptyStateVisible"
            :type="emptyStateType"
            :text="emptyStateText"
        />

        <ul id="learningCoursesContainer" class="row g-3 list-unstyled">
            <li
                v-for="course in filteredCourses"
                :key="course.id"
                class="col-12 col-md-6 col-xl-4"
            >
                <LearningCourseCard :course="course" />
            </li>
        </ul>
    </main>
</template>
