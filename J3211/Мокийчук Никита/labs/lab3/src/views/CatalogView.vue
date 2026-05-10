<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCourses } from '../composables/useCourses'
import CourseCard from '../components/CourseCard.vue'
import EmptyState from '../components/EmptyState.vue'

const route = useRoute()
const { courses, loading, error, loadCourses, sortCourses, filterCourses } = useCourses()

const searchQuery = ref('')
const subjects = ref([])
const levels = ref([])
const maxPrice = ref(10000)
const currentSort = ref('popular')
const sortLabel = ref('Сортировка')

const sortOptions = [
  { value: 'popular', label: 'По популярности' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'price-asc', label: 'Сначала дешевые' },
  { value: 'price-desc', label: 'Сначала дорогие' },
  { value: 'new', label: 'Новинки' }
]

const subjectOptions = [
  { value: 'programming', label: 'Программирование' },
  { value: 'design', label: 'Дизайн' },
  { value: 'marketing', label: 'Маркетинг' },
  { value: 'analytics', label: 'Аналитика' },
  { value: 'languages', label: 'Языки' }
]

const levelOptions = [
  { value: 'beginner', label: 'Начальный' },
  { value: 'intermediate', label: 'Средний' },
  { value: 'advanced', label: 'Продвинутый' }
]

const filteredCourses = computed(() => {
  const filtered = filterCourses(courses.value, {
    query: searchQuery.value,
    subjects: subjects.value,
    levels: levels.value,
    maxPrice: maxPrice.value
  })
  return sortCourses(filtered, currentSort.value)
})

const priceLabel = computed(() =>
  Number(maxPrice.value) === 10000
    ? '10 000+'
    : Number(maxPrice.value).toLocaleString('ru-RU')
)

const setSort = (option) => {
  currentSort.value = option.value
  sortLabel.value = option.label
}

const resetFilters = () => {
  searchQuery.value = ''
  subjects.value = []
  levels.value = []
  maxPrice.value = 10000
  currentSort.value = 'popular'
  sortLabel.value = 'Сортировка'
}

watch(
  () => route.query.category,
  (category) => {
    if (category && !subjects.value.includes(category)) {
      subjects.value = [String(category)]
    }
  },
  { immediate: false }
)

onMounted(async () => {
  await loadCourses()
  if (route.query.category) {
    subjects.value = [String(route.query.category)]
  }
})
</script>

<template>
  <div class="mt-navbar-lg"></div>

  <section class="py-4 bg-white" aria-labelledby="catalog-heading">
    <div class="container">
      <h1 class="section-title mb-3" id="catalog-heading">Каталог курсов</h1>
      <div class="row g-3 align-items-center">
        <div class="col-lg-8">
          <div class="search-bar">
            <svg class="svg-icon" aria-hidden="true">
              <use href="/sprite/sprite.svg#icon-search"></use>
            </svg>
            <label for="courseSearch" class="visually-hidden">Поиск по названию курса</label>
            <input
              type="search"
              class="form-control"
              id="courseSearch"
              placeholder="Поиск по названию курса..."
              autocomplete="off"
              v-model="searchQuery"
            />
          </div>
        </div>
        <div class="col-lg-4">
          <div class="d-flex gap-2 align-items-center justify-content-lg-end">
            <p class="text-muted search-count mb-0">
              Найдено: <strong>{{ filteredCourses.length }}</strong> курсов
            </p>
            <div class="dropdown">
              <button
                class="btn btn-outline-secondary btn-sm dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{sortLabel}}
              </button>
              <ul class="dropdown-menu">
                <li v-for="option in sortOptions" :key="option.value">
                  <a class="dropdown-item" href="#" @click.prevent="setSort(option)">
                    {{ option.label }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section pt-reduced" aria-label="Фильтры и результаты поиска курсов">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-3">
          <nav class="filter-panel" aria-label="Фильтры курсов">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h5 fw-bold mb-0">Фильтры</h2>
              <button class="btn btn-sm btn-link text-decoration-none p-0" @click="resetFilters">
                Сбросить
              </button>
            </div>

            <fieldset>
              <legend class="h6 mb-2">
                <i class="bi bi-bookmark me-2" aria-hidden="true"></i>Предмет
              </legend>
              <div
                v-for="opt in subjectOptions"
                :key="opt.value"
                class="form-check mb-1"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="opt.value"
                  :id="`subj-${opt.value}`"
                  v-model="subjects"
                />
                <label class="form-check-label" :for="`subj-${opt.value}`">{{ opt.label }}</label>
              </div>
            </fieldset>

            <fieldset class="mt-3">
              <legend class="h6 mb-2">
                <i class="bi bi-bar-chart-steps me-2" aria-hidden="true"></i>Уровень
              </legend>
              <div
                v-for="opt in levelOptions"
                :key="opt.value"
                class="form-check mb-1">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="opt.value"
                  :id="`lvl-${opt.value}`"
                  v-model="levels"
                />
                <label class="form-check-label" :for="`lvl-${opt.value}`">{{ opt.label }}</label>
              </div>
            </fieldset>

            <div class="mt-3">
              <label for="priceRange" class="h6 mb-1">
                <i class="bi bi-currency-dollar me-2" aria-hidden="true"></i>
                Цена до: <span>{{ priceLabel }}</span> ₽
              </label>
              <input
                type="range"
                class="form-range"
                id="priceRange"
                min="0"
                max="10000"
                step="500"
                v-model.number="maxPrice"
              />
              <div class="d-flex justify-content-between text-filter-hint">
                <span>Бесплатно</span>
                <span>10 000+ ₽</span>
              </div>
            </div>
          </nav>
        </div>

        <div class="col-lg-9">
          <div class="row g-4">
            <template v-if="loading && courses.length === 0">
              <EmptyState text="Загружаем курсы..." />
            </template>
            <template v-else-if="error">
              <EmptyState :text="error" variant="danger" />
            </template>
            <template v-else-if="filteredCourses.length">
              <CourseCard
                v-for="course in filteredCourses"
                :key="course.id"
                :course="course"
                mode="catalog"
              />
            </template>
            <template v-else>
              <EmptyState text="По вашему запросу курсы не найдены" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
