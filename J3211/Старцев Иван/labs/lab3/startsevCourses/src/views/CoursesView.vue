<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import AppAlert from '@/components/AppAlert.vue'
import CatalogCourseCard from '@/components/CatalogCourseCard.vue'
import CoursesFilters from '@/components/coursesFilters.vue'
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

                        <CoursesFilters
                            id-prefix="desktop"
                            v-model:level="filters.level"
                            v-model:min-price="filters.minPrice"
                            v-model:max-price="filters.maxPrice"
                            v-model:language="filters.language"
                        />
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
                        <CatalogCourseCard :course="course" />
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
                    <CoursesFilters
                        id-prefix="mobile"
                        v-model:level="filters.level"
                        v-model:min-price="filters.minPrice"
                        v-model:max-price="filters.maxPrice"
                        v-model:language="filters.language"
                    />
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
