<script setup>
import { ref, onMounted } from 'vue'
import AppSidebar from '../components/AppSidebar.vue'
import CourseCard from '../components/CourseCard.vue'
import { useApi }     from '../composables/useApi.js'
import { useCourses } from '../composables/useCourses.js'

const { get } = useApi()

const allCourses = ref([])
const loading    = ref(true)
const error      = ref('')

const { search, subject, level, price, filtered, resetFilters } = useCourses(allCourses)

onMounted(async () => {
  try {
    allCourses.value = await get('/courses', { status: 'published' })
  } catch {
    error.value = 'Ошибка загрузки. Убедитесь, что json-server запущен (npm run api).'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="main-wrapper">
    <AppSidebar />

    <div class="main-content">
      <div style="margin-bottom:1.5rem;">
        <h1 class="page-title">Каталог курсов</h1>
        <p class="page-subtitle">Найдите курс, который подойдёт именно вам</p>
      </div>

      <!-- Строка фильтров -->
      <div class="search-bar">
        <input v-model="search" class="search-input" type="text" placeholder="Поиск по названию, теме или автору…">

        <select v-model="subject" class="filter-select">
          <option value="">Все предметы</option>
          <option value="Программирование">Программирование</option>
          <option value="Дизайн">Дизайн</option>
          <option value="Математика">Математика</option>
          <option value="ML / AI">ML / AI</option>
          <option value="Базы данных">Базы данных</option>
        </select>

        <select v-model="level" class="filter-select">
          <option value="">Любой уровень</option>
          <option value="Начинающий">Начинающий</option>
          <option value="Средний">Средний</option>
          <option value="Продвинутый">Продвинутый</option>
        </select>

        <select v-model="price" class="filter-select">
          <option value="">Любая цена</option>
          <option value="free">Бесплатно</option>
          <option value="1000">До 1 000 ₽</option>
          <option value="3000">До 3 000 ₽</option>
        </select>

        <button class="btn-clear" type="button" @click="resetFilters">Сброс</button>
      </div>

      <div class="results-info">
        <span v-if="loading">Загрузка…</span>
        <span v-else-if="error" style="color:#E24B4A;">{{ error }}</span>
        <span v-else>Найдено {{ filtered.length }} курсов</span>
      </div>

      <div class="courses-grid">
        <CourseCard v-for="course in filtered" :key="course.id" :course="course" />
      </div>

      <div v-if="!loading && !error && filtered.length === 0" style="color:var(--muted);font-size:14px;padding:24px 0;">
        По вашему запросу ничего не найдено. Попробуйте изменить фильтры.
      </div>
    </div>
  </div>
</template>
