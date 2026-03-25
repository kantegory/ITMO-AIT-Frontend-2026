<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppAlert from '@/components/AppAlert.vue'
import { useCourses } from '@/composables/useCourses'
import { usePageMeta } from '@/composables/usePageMeta'
import { useCoursesStore } from '@/stores/courses'

const coursesStore = useCoursesStore()
const { catalogCourses } = useCourses()
const { setPageMeta } = usePageMeta()

const searchInput = ref('')

const filters = reactive({
    level: 'any',
    minPrice: '',
    maxPrice: '',
    language: 'any',
})

const normalizedFilters = computed(() => ({
    level: filters.level,
    minPrice: filters.minPrice === '' ? null : Number(filters.minPrice),
    maxPrice: filters.maxPrice === '' ? null : Number(filters.maxPrice),
    language: filters.language,
}))

const filteredCourses = computed(() => {
    const query = searchInput.value.trim().toLowerCase()
    const currentFilters = normalizedFilters.value

    return catalogCourses.value.filter(
        (course) =>
            (!query || course.title.toLowerCase().includes(query)) &&
            (currentFilters.level === 'any' || course.level === currentFilters.level) &&
            (currentFilters.language === 'any' || course.language === currentFilters.language) &&
            (currentFilters.minPrice === null || course.price >= currentFilters.minPrice) &&
            (currentFilters.maxPrice === null || course.price <= currentFilters.maxPrice),
    )
})

const emptyStateText = computed(() =>
    coursesStore.error || 'Курсы не найдены.',
)

const emptyStateVisible = computed(() =>
    Boolean(coursesStore.error) || (!coursesStore.isLoading && filteredCourses.value.length === 0),
)

const emptyStateType = computed(() =>
    coursesStore.error ? 'danger' : 'secondary',
)

onMounted(async () => {
    setPageMeta('Курсы', 'Большая коллекция онлайн курсов на любую тему для любого уровня')


    await coursesStore.loadCourses(true)
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
                            <select id="desktopLevel" v-model="filters.level" class="form-select">
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
                                        v-model="filters.minPrice"
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
                                        v-model="filters.maxPrice"
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
                            <select id="desktopLanguage" v-model="filters.language" class="form-select">
                                <option value="any">Любой</option>
                                <option value="Русский">Русский</option>
                                <option value="Английский">Английский</option>
                            </select>
                        </div>
                    </div>
                </div>
            </aside>

            <section class="col-12 col-md-8 col-lg-9">
                <h1 class="visually-hidden">Каталог курсов</h1>

                <div class="sticky-top catalog-page__search">
                    <form id="searchForm" role="search" class="input-group mb-3" @submit.prevent>
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
                    </form>
                </div>

                <AppAlert
                    :visible="emptyStateVisible"
                    :type="emptyStateType"
                    :text="emptyStateText"
                />

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
                                    <strong>Автор:</strong> {{ course.authorName }}
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
                                    {{ course.rating.toFixed(1) }} / 5
                                </p>
                                <p class="card-text mb-3">
                                    <svg class="card__users" aria-hidden="true">
                                        <use href="/sprites.svg#users"></use>
                                    </svg>
                                    {{ course.studentsCount }} участников
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
                        <select id="mobileLevel" v-model="filters.level" class="form-select">
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
                                    v-model="filters.minPrice"
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
                                    v-model="filters.maxPrice"
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
                        <select id="mobileLanguage" v-model="filters.language" class="form-select">
                            <option value="any">Любой</option>
                            <option value="Русский">Русский</option>
                            <option value="Английский">Английский</option>
                        </select>
                    </div>
                </div>

                <div class="modal-footer">
                    <button
                        id="mobileCloseBtn"
                        type="button"
                        class="btn btn-primary"
                        data-bs-dismiss="modal"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
