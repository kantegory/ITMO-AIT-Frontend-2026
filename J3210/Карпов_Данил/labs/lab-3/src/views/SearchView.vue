<template>
  <div class="container py-4">
    <h2 class="fw-bold mb-4">Каталог курсов</h2>
    <div class="row g-4">
      <!-- Sidebar Filters -->
      <div class="col-lg-3">
        <div class="card shadow-sm p-3">
          <h6 class="fw-bold mb-3">Фильтры</h6>

          <div class="mb-3">
            <label class="form-label small fw-semibold">Поиск</label>
            <input
              v-model="search"
              type="search"
              class="form-control form-control-sm"
              placeholder="Название курса…"
            />
          </div>

          <div class="mb-3">
            <label class="form-label small fw-semibold">Категория</label>
            <select v-model="filters.category" class="form-select form-select-sm">
              <option value="">Все</option>
              <option value="programming">Программирование</option>
              <option value="design">Дизайн</option>
              <option value="data">Data Science</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-semibold">Уровень</label>
            <select v-model="filters.level" class="form-select form-select-sm">
              <option value="">Все</option>
              <option value="beginner">Начинающий</option>
              <option value="intermediate">Средний</option>
              <option value="advanced">Продвинутый</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-semibold">Цена</label>
            <select v-model="filters.priceType" class="form-select form-select-sm">
              <option value="">Все</option>
              <option value="free">Бесплатно</option>
              <option value="paid">Платные</option>
            </select>
          </div>

          <button class="btn btn-outline-secondary btn-sm w-100" @click="resetFilters">
            Сбросить
          </button>
        </div>
      </div>

      <!-- Course Grid -->
      <div class="col-lg-9">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-muted small">Найдено: {{ filtered.length }} курсов</span>
          <select v-model="sortBy" class="form-select form-select-sm" style="width: auto">
            <option value="rating">По рейтингу</option>
            <option value="price">По цене</option>
            <option value="title">По названию</option>
          </select>
        </div>

        <div v-if="loading" class="row g-4">
          <div v-for="n in 6" :key="n" class="col-md-4">
            <SkeletonCard />
          </div>
        </div>

        <div v-else-if="filtered.length === 0" class="text-center text-muted py-5">
          <i class="bi bi-search fs-1 d-block mb-2"></i>
          Курсы не найдены. Попробуйте изменить фильтры.
        </div>

        <div v-else class="row g-4">
          <div v-for="course in filtered" :key="course.id" class="col-md-4">
            <CourseCard :course="course" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CourseCard from '@/components/CourseCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import { useCourses } from '@/composables/useCourses'

const { courses, loading, fetchCourses } = useCourses()

const search = ref('')
const sortBy = ref('rating')
const filters = ref({ category: '', level: '', priceType: '' })

onMounted(() => fetchCourses())

function resetFilters() {
  search.value = ''
  filters.value = { category: '', level: '', priceType: '' }
}

const filtered = computed(() => {
  let list = courses.value

  if (search.value)
    list = list.filter((c) => c.title.toLowerCase().includes(search.value.toLowerCase()))
  if (filters.value.category) list = list.filter((c) => c.category === filters.value.category)
  if (filters.value.level) list = list.filter((c) => c.level === filters.value.level)
  if (filters.value.priceType)
    list = list.filter((c) => c.priceType === filters.value.priceType)

  return [...list].sort((a, b) => {
    if (sortBy.value === 'rating') return b.rating - a.rating
    if (sortBy.value === 'price') return a.price - b.price
    return a.title.localeCompare(b.title)
  })
})
</script>
