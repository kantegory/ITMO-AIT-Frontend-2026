<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { coursesApi } from '@/api'
import { useSessionStore } from '@/stores/session'

const sessionStore = useSessionStore()
const currentUser = computed(() => sessionStore.currentUser)

const allCourses = ref([])
const searchInput = ref('')
const hasLoadError = ref(false)

const learningCourses = computed(() =>
    allCourses.value
        .filter((course) => currentUser.value.learningCourseIds.includes(course.id))
        .map((course) => ({
            ...course,
            rating: course.comments.length
                ? course.comments.reduce((sum, comment) => sum + comment.rating, 0) / course.comments.length
                : 0,
        })),
)

const filteredCourses = computed(() => {
    const query = searchInput.value.trim().toLowerCase()

    return learningCourses.value.filter(
        (course) => !query || course.title.toLowerCase().includes(query),
    )
})

const emptyStateVisible = computed(() =>
    hasLoadError.value || filteredCourses.value.length === 0,
)

const emptyStateText = computed(() =>
    hasLoadError.value ? 'Не удалось загрузить информацию.' : 'Курсы не найдены.',
)

const emptyStateType = computed(() =>
    hasLoadError.value ? 'danger' : 'secondary',
)

const loadData = async () => {
    try {
        allCourses.value = await coursesApi.getAll()
    } catch {
        hasLoadError.value = true
    }
}

onMounted(() => {
    document.title = 'Моё обучение'

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
        metaDescription.setAttribute('content', 'Ваши активные курсы.')
    }

    loadData()
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
            <button class="btn btn-primary" type="submit">
                <svg class="default_svg" aria-hidden="true">
                    <use href="/sprites.svg#lupa"></use>
                </svg>
                Искать
            </button>
        </form>

        <div
            v-if="emptyStateVisible"
            :class="`alert alert-${emptyStateType}`"
            role="alert"
        >
            {{ emptyStateText }}
        </div>

        <ul id="learningCoursesContainer" class="row g-3 list-unstyled">
            <li
                v-for="course in filteredCourses"
                :key="course.id"
                class="col-12 col-md-6 col-xl-4"
            >
                <article class="card h-100">
                    <img :src="course.image" class="card-img-top" :alt="course.title">

                    <div class="card-body d-flex flex-column">
                        <h2 class="card-title">{{ course.title }}</h2>
                        <p class="card-text text-muted small mb-1">{{ course.description }}</p>

                        <p class="card-text mb-2">
                            <svg class="rating__star" aria-hidden="true">
                                <use href="/sprites.svg#ratingStar"></use>
                            </svg>
                            {{ course.rating.toFixed(1) }} / 5
                        </p>

                        <div class="mt-auto">
                            <RouterLink
                                :to="{ name: 'lesson', params: { id: course.id } }"
                                class="btn btn-success btn-sm"
                            >
                                Продолжить
                            </RouterLink>

                            <RouterLink
                                :to="{ name: 'course', params: { id: course.id } }"
                                class="btn btn-outline-primary btn-sm ms-1"
                            >
                                О курсе
                            </RouterLink>
                        </div>
                    </div>
                </article>
            </li>
        </ul>
    </main>
</template>
