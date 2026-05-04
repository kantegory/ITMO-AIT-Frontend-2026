<template>
  <main class="flex-grow-1 py-5">
    <div class="container">
      <div class="text-center mb-5">
        <h1 class="display-5 fw-bold mb-3">Каталог курсов</h1>
        <p class="text-muted fs-5">Найдите идеальный курс для вашего уровня и интересов</p>
      </div>

      <!-- Поиск и сортировка -->
      <div class="row align-items-center mb-4">
        <div class="col-lg-8">
          <div class="input-group">
            <span class="input-group-text bg-body-tertiary border-end-0">
              <svg class="icon icon-lg text-muted" aria-hidden="true"><use href="#icon-magnifying-glass"></use></svg>
            </span>
            <input
              type="text"
              class="form-control border-start-0"
              id="courseSearch"
              v-model="searchQuery"
              placeholder="Поиск по названию курса, преподавателю или ключевым словам..."
            >
          </div>
        </div>
        <div class="col-lg-4">
          <div class="d-flex gap-2 justify-content-lg-end">
            <label for="sortSelect" class="visually-hidden">Сортировка курсов</label>
            <select class="form-select" id="sortSelect" v-model="sortBy" @change="onSortChange">
              <option value="rating">По рейтингу</option>
              <option value="price-low">Цена: по возрастанию</option>
              <option value="price-high">Цена: по убыванию</option>
            </select>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Боковая панель фильтров -->
        <div class="col-lg-3">
          <aside class="collapse d-lg-block" id="filterSidebar">
            <div class="mb-4">
              <div class="fw-bold mb-2" id="subjectLabel">
                <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-book"></use></svg>Предмет
              </div>
              <div class="d-flex flex-column gap-2" role="group" aria-labelledby="subjectLabel">
                <div v-for="subject in subjectOptions" :key="subject.value" class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="`filter-${subject.value}`"
                    :value="subject.value"
                    v-model="selectedSubjects"
                    @change="onFilterChange"
                  >
                  <label class="form-check-label" :for="`filter-${subject.value}`">
                    {{ subject.label }}
                  </label>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <div class="fw-bold mb-2" id="levelLabel">
                <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-signal"></use></svg>Уровень
              </div>
              <div class="d-flex flex-column gap-2" role="group" aria-labelledby="levelLabel">
                <div v-for="level in levelOptions" :key="level.value" class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="`level-${level.value}`"
                    :value="level.value"
                    v-model="selectedLevels"
                    @change="onFilterChange"
                  >
                  <label class="form-check-label" :for="`level-${level.value}`">
                    <span :class="['badge', level.badgeClass, 'me-1']">{{ level.label }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <fieldset>
                <legend class="fw-bold mb-2">
                  <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-ruble-sign"></use></svg>Цена
                </legend>
                <div class="d-flex gap-2 mb-3">
                  <label for="priceMin" class="visually-hidden">Минимальная цена</label>
                  <input
                    type="number"
                    class="form-control"
                    id="priceMin"
                    placeholder="От"
                    min="0"
                    v-model.number="priceMin"
                    @input="onFilterChange"
                    aria-label="Минимальная цена"
                  >
                  <span class="align-self-center" aria-hidden="true">-</span>
                  <label for="priceMax" class="visually-hidden">Максимальная цена</label>
                  <input
                    type="number"
                    class="form-control"
                    id="priceMax"
                    placeholder="До"
                    min="0"
                    v-model.number="priceMax"
                    @input="onFilterChange"
                    aria-label="Максимальная цена"
                  >
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="filter-free"
                    v-model="freeOnly"
                    @change="onFilterChange"
                  >
                  <label class="form-check-label" for="filter-free">Только бесплатные</label>
                </div>
              </fieldset>
            </div>

            <div class="mb-4">
              <div class="fw-bold mb-2" id="durationLabel">
                <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-clock"></use></svg>Длительность
              </div>
              <div class="d-flex flex-column gap-2" role="group" aria-labelledby="durationLabel">
                <div v-for="d in durationOptions" :key="d.value" class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="`duration-${d.value}`"
                    :value="d.value"
                    v-model="selectedDurations"
                    @change="onFilterChange"
                  >
                  <label class="form-check-label" :for="`duration-${d.value}`">
                    {{ d.label }}
                  </label>
                </div>
              </div>
            </div>

            <div class="d-grid gap-2">
              <button class="btn btn-primary" id="applyFilters" @click="applyFilters">
                <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-check"></use></svg>Применить
              </button>
              <button class="btn btn-outline-secondary" id="resetFilters" @click="resetFilters">
                <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-rotate-left"></use></svg>Сбросить
              </button>
            </div>
          </aside>
        </div>

        <!-- Список курсов -->
        <div class="col-lg-9">
          <div class="mb-3" id="activeFilters" aria-live="polite"></div>

          <div class="d-flex justify-content-between align-items-center mb-4">
            <span id="resultsCount" aria-live="polite" aria-atomic="true">
              Найдено курсов: {{ total }}
            </span>
          </div>

          <h2 class="visually-hidden">Список курсов</h2>

          <!-- Индикатор загрузки -->
          <div v-if="loading" class="text-center py-5">
            <AppSpinner text="Загрузка курсов..." />
          </div>

          <!-- Список курсов -->
          <div v-else-if="courses.length" class="row g-4" id="coursesList" role="list">
            <CourseCard v-for="course in courses" :key="course.id" :course="course" />
          </div>

          <!-- Сообщение "Ничего не найдено" -->
          <div v-else class="d-flex flex-column align-items-center py-5" id="noResults">
            <svg class="icon text-muted mb-3" style="width: 3em; height: 3em;" aria-hidden="true"><use href="#icon-inbox"></use></svg>
            <h3 class="fw-bold mb-2">Ничего не найдено</h3>
            <p class="text-muted">Попробуйте изменить параметры поиска или фильтры</p>
            <button class="btn btn-primary mt-3" id="resetFromNoResults" @click="resetFilters">
              <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-rotate-left"></use></svg>Сбросить фильтры
            </button>
          </div>

          <!-- Пагинация -->
          <nav v-if="totalPages > 1" class="mt-5" aria-label="Навигация по страницам курсов">
            <ul class="pagination justify-content-center" id="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)" aria-label="Предыдущая страница">
                  <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-chevron-left"></use></svg>
                </a>
              </li>
              <li
                v-for="page in totalPages"
                :key="page"
                class="page-item"
                :class="{ active: page === currentPage }"
                :aria-current="page === currentPage ? 'page' : undefined"
              >
                <a class="page-link" href="#" @click.prevent="goToPage(page)" :aria-label="`Перейти на страницу ${page}`">
                  {{ page }}
                </a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)" aria-label="Следующая страница">
                  <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-chevron-right"></use></svg>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { getCourses } from '@/services/api'
import CourseCard from '@/components/courses/CourseCard.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'

const subjectOptions = [
  { value: 'deep-learning', label: 'Deep Learning' },
  { value: 'nlp', label: 'NLP' },
  { value: 'cv', label: 'Computer Vision' },
  { value: 'rl', label: 'Reinforcement Learning' },
  { value: 'gen-ai', label: 'Generative AI' },
  { value: 'ml-basics', label: 'Основы ML' }
]

const levelOptions = [
  { value: 'beginner', label: 'Новичок', badgeClass: 'bg-success' },
  { value: 'intermediate', label: 'Средний', badgeClass: 'bg-warning text-dark' },
  { value: 'advanced', label: 'Продвинутый', badgeClass: 'bg-danger' }
]

const durationOptions = [
  { value: 'short', label: 'До 20 часов' },
  { value: 'medium', label: '20-50 часов' },
  { value: 'long', label: 'Более 50 часов' }
]

const searchQuery = ref('')
const sortBy = ref('rating')
const selectedSubjects = ref(subjectOptions.map(s => s.value))
const selectedLevels = ref(levelOptions.map(l => l.value))
const selectedDurations = ref(durationOptions.map(d => d.value))
const priceMin = ref(0)
const priceMax = ref(100000)
const freeOnly = ref(false)

const courses = ref([])
const total = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const limit = 9

let debounceTimer = null

async function fetchCourses() {
  loading.value = true
  try {
    const params = {
      _page: currentPage.value,
      _limit: limit,
      _expand: 'instructor'
    }

    if (searchQuery.value) {
      params.q = searchQuery.value
    }

    if (selectedSubjects.value.length) {
      params.subject = selectedSubjects.value
    }
    if (selectedLevels.value.length) {
      params.level = selectedLevels.value
    }
    if (selectedDurations.value.length) {
      params.duration_category = selectedDurations.value
    }

    if (freeOnly.value) {
      params.price = 0
    } else {
      params.price_gte = priceMin.value
      params.price_lte = priceMax.value
    }

    if (sortBy.value === 'price-low') {
      params._sort = 'price'
      params._order = 'asc'
    } else if (sortBy.value === 'price-high') {
      params._sort = 'price'
      params._order = 'desc'
    } else {
      params._sort = 'rating'
      params._order = 'desc'
    }

    const response = await getCourses(params)
    courses.value = response.courses
    total.value = response.total
  } catch (error) {
    console.error('Ошибка загрузки курсов:', error)
    courses.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  searchQuery.value = ''
  sortBy.value = 'rating'
  selectedSubjects.value = subjectOptions.map(s => s.value)
  selectedLevels.value = levelOptions.map(l => l.value)
  selectedDurations.value = durationOptions.map(d => d.value)
  priceMin.value = 0
  priceMax.value = 100000
  freeOnly.value = false
  currentPage.value = 1
  fetchCourses()
}

function applyFilters() {
  currentPage.value = 1
  fetchCourses()
}

function onSortChange() {
  currentPage.value = 1
  fetchCourses()
}

function onFilterChange() {
  currentPage.value = 1
  fetchCourses()
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchCourses()
}

watch(searchQuery, () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    currentPage.value = 1
    fetchCourses()
  }, 300)
})

const totalPages = computed(() => Math.ceil(total.value / limit))

fetchCourses()
</script>
