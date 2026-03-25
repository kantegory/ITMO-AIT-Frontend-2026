<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { coursesApi, usersApi } from '@/api'

const emptyStateText = ref('Курсы не найдены.')
const emptyStateVisible = ref(false)
const filteredCourses = ref([])
const courses = ref([])
const users = ref([])
const searchInput = ref('')
const isDesktop = ref(false)
const hasLoadError = ref(false)

const desktopFilters = reactive({
    level: 'any',
    minPrice: '',
    maxPrice: '',
    language: 'any',
})

const mobileFilters = reactive({
    level: 'any',
    minPrice: '',
    maxPrice: '',
    language: 'any',
})

let mediaQuery = null

const getCourseRating = (course) => {
    if (!course.comments.length) {
        return 0
    }

    const total = course.comments.reduce((sum, comment) => sum + comment.rating, 0)
    return total / course.comments.length
}

const getCourseStudents = (courseId) =>
    users.value.filter((user) => user.learningCourseIds.includes(courseId)).length

const getAuthorName = (course) => {
    const user = users.value.find((item) => item.id === course.userId)
    return user ? user.name : 'Неизвестный автор'
}

const readFilters = (prefix) => {
    const source = prefix === 'desktop' ? desktopFilters : mobileFilters

    return {
        level: source.level,
        minPrice: source.minPrice === '' ? null : Number(source.minPrice),
        maxPrice: source.maxPrice === '' ? null : Number(source.maxPrice),
        language: source.language,
    }
}

const render = () => {
    if (hasLoadError.value) {
        return
    }

    const query = searchInput.value.trim().toLowerCase()
    const filters = readFilters(isDesktop.value ? 'desktop' : 'mobile')

    filteredCourses.value = courses.value.filter(
        (course) =>
            (!query || course.title.toLowerCase().includes(query)) &&
            (filters.level === 'any' || course.level === filters.level) &&
            (filters.language === 'any' || course.language === filters.language) &&
            (filters.minPrice === null || course.price >= filters.minPrice) &&
            (filters.maxPrice === null || course.price <= filters.maxPrice),
    )

    emptyStateText.value = 'Курсы не найдены.'
    emptyStateVisible.value = filteredCourses.value.length === 0
}

const handleSearchSubmit = () => {
    render()
}

const applyDesktopFilters = () => {
    render()
}

const applyMobileFilters = () => {
    render()
}

const handleViewportChange = (event) => {
    isDesktop.value = event.matches
    render()
}

const init = async () => {
    try {
        courses.value = await coursesApi.getAll()
        users.value = await usersApi.getAll()
        render()
    } catch {
        hasLoadError.value = true
        filteredCourses.value = []
        emptyStateText.value = 'Не удалось загрузить курсы.'
        emptyStateVisible.value = true
    }
}

onMounted(() => {
    document.title = 'Курсы'

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
        metaDescription.setAttribute(
            'content',
            'Большая коллекция онлайн курсов на любую тему для любого уровня',
        )
    }

    mediaQuery = window.matchMedia('(min-width: 768px)')
    isDesktop.value = mediaQuery.matches

    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleViewportChange)
    } else {
        mediaQuery.addListener(handleViewportChange)
    }

    init()
})

onBeforeUnmount(() => {
    if (!mediaQuery) {
        return
    }

    if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleViewportChange)
    } else {
        mediaQuery.removeListener(handleViewportChange)
    }
})
</script>

<template>
    <main class="container-fluid pt-2 pb-3">
        <div class="row g-3 z-0 position-relative">
            <aside class="d-none d-md-block col-md-4 col-lg-3">
                <div class="card sticky-top catalog-page__filters">
                    <div class="card-body">
                        <h2 class="card-title mb-3">Фильтры</h2>

                        <div class="mb-3">
                            <label for="desktopLevel" class="form-label">Сложность</label>
                            <select id="desktopLevel" v-model="desktopFilters.level" class="form-select">
                                <option value="any">Любая</option>
                                <option value="Начальный">Начальный</option>
                                <option value="Средний">Средний</option>
                                <option value="Продвинутый">Продвинутый</option>
                            </select>
                        </div>

                        <fieldset class="mb-3">
                            <legend class="form-label">Цена</legend>

                            <div class="row g-2">
                                <div class="col-6">
                                    <label for="desktopMinPrice" class="visually-hidden">
                                        Введите минимальную цену
                                    </label>
                                    <input
                                        id="desktopMinPrice"
                                        v-model="desktopFilters.minPrice"
                                        type="number"
                                        class="form-control"
                                        placeholder="От"
                                        min="0"
                                    >
                                </div>

                                <div class="col-6">
                                    <label for="desktopMaxPrice" class="visually-hidden">
                                        Введите максимальную цену
                                    </label>
                                    <input
                                        id="desktopMaxPrice"
                                        v-model="desktopFilters.maxPrice"
                                        type="number"
                                        class="form-control"
                                        placeholder="До"
                                        min="0"
                                    >
                                </div>
                            </div>
                        </fieldset>

                        <div class="mb-3">
                            <label for="desktopLanguage" class="form-label">Язык</label>
                            <select id="desktopLanguage" v-model="desktopFilters.language" class="form-select">
                                <option value="any">Любой</option>
                                <option value="Русский">Русский</option>
                                <option value="Английский">Английский</option>
                            </select>
                        </div>

                        <button
                            id="desktopApplyBtn"
                            type="button"
                            class="btn btn-primary w-100"
                            @click="applyDesktopFilters"
                        >
                            Применить
                        </button>
                    </div>
                </div>
            </aside>

            <section class="col-12 col-md-8 col-lg-9">
                <h1 class="visually-hidden">Каталог курсов</h1>

                <div class="sticky-top catalog-page__search">
                    <form id="searchForm" role="search" class="input-group mb-3" @submit.prevent="handleSearchSubmit">
                        <label for="searchInput" class="visually-hidden">
                            Поиск по названию курса
                        </label>

                        <input
                            id="searchInput"
                            v-model="searchInput"
                            type="search"
                            class="form-control"
                            placeholder="Введите название курса"
                        >

                        <button
                            class="btn btn-secondary d-md-none"
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#filtersModal"
                            aria-label="Открыть фильтры"
                        >
                            <svg class="default_svg" aria-hidden="true">
                                <use href="/sprites.svg#funnel"></use>
                            </svg>
                        </button>

                        <button class="btn btn-primary" type="submit" aria-label="Искать">
                            <svg class="default_svg" aria-hidden="true">
                                <use href="/sprites.svg#lupa"></use>
                            </svg>
                            <span class="d-none d-sm-inline ms-1">Искать</span>
                        </button>
                    </form>
                </div>

                <div v-if="emptyStateVisible" class="alert alert-secondary" role="alert">
                    {{ emptyStateText }}
                </div>

                <ul id="coursesContainer" class="row g-3 list-unstyled">
                    <li
                        v-for="course in filteredCourses"
                        :key="course.id"
                        class="col-12 col-sm-6 col-xl-4"
                    >
                        <article class="card h-100">
                            <img :src="course.image" class="card-img-top" :alt="course.title">

                            <div class="card-body d-flex flex-column">
                                <h2 class="h5 card-title">{{ course.title }}</h2>
                                <p class="card-text text-muted small mb-2">{{ course.description }}</p>
                                <p class="card-text mb-1">
                                    <strong>Автор:</strong> {{ getAuthorName(course) }}
                                </p>
                                <p class="card-text mb-1">
                                    <strong>Уровень:</strong> {{ course.level }}
                                </p>
                                <p class="card-text mb-1">
                                    <strong>Язык:</strong> {{ course.language }}
                                </p>
                                <p class="card-text mb-1">
                                    <svg class="rating__star" aria-hidden="true">
                                        <use href="/sprites.svg#ratingStar"></use>
                                    </svg>
                                    {{ getCourseRating(course).toFixed(1) }} / 5
                                </p>
                                <p class="card-text mb-3">
                                    <svg class="card__users" aria-hidden="true">
                                        <use href="/sprites.svg#users"></use>
                                    </svg>
                                    {{ getCourseStudents(course.id) }} участников
                                </p>

                                <div class="mt-auto">
                                    <span class="badge bg-primary fs-6">{{ course.price }} ₽</span>
                                    <RouterLink
                                        :to="{ name: 'course', params: { id: course.id } }"
                                        class="btn btn-sm btn-outline-primary ms-2"
                                    >
                                        Подробнее
                                    </RouterLink>
                                </div>
                            </div>
                        </article>
                    </li>
                </ul>
            </section>
        </div>
    </main>

    <div
        id="filtersModal"
        class="modal fade"
        tabindex="-1"
        aria-labelledby="filtersModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="filtersModalLabel" class="modal-title">Фильтры</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                </div>

                <div class="modal-body">
                    <div class="mb-3">
                        <label for="mobileLevel" class="form-label">Сложность</label>
                        <select id="mobileLevel" v-model="mobileFilters.level" class="form-select">
                            <option value="any">Любая</option>
                            <option value="Начальный">Начальный</option>
                            <option value="Средний">Средний</option>
                            <option value="Продвинутый">Продвинутый</option>
                        </select>
                    </div>

                    <fieldset class="mb-3">
                        <legend class="form-label">Цена</legend>

                        <div class="row g-2">
                            <div class="col-6">
                                <label for="mobileMinPrice" class="visually-hidden">
                                    Введите минимальную цену
                                </label>
                                <input
                                    id="mobileMinPrice"
                                    v-model="mobileFilters.minPrice"
                                    type="number"
                                    class="form-control"
                                    placeholder="От"
                                    min="0"
                                >
                            </div>

                            <div class="col-6">
                                <label for="mobileMaxPrice" class="visually-hidden">
                                    Введите максимальную цену
                                </label>
                                <input
                                    id="mobileMaxPrice"
                                    v-model="mobileFilters.maxPrice"
                                    type="number"
                                    class="form-control"
                                    placeholder="До"
                                    min="0"
                                >
                            </div>
                        </div>
                    </fieldset>

                    <div class="mb-3">
                        <label for="mobileLanguage" class="form-label">Язык</label>
                        <select id="mobileLanguage" v-model="mobileFilters.language" class="form-select">
                            <option value="any">Любой</option>
                            <option value="Русский">Русский</option>
                            <option value="Английский">Английский</option>
                        </select>
                    </div>
                </div>

                <div class="modal-footer">
                    <button
                        id="mobileApplyBtn"
                        type="button"
                        class="btn btn-primary"
                        data-bs-dismiss="modal"
                        @click="applyMobileFilters"
                    >
                        Применить
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
