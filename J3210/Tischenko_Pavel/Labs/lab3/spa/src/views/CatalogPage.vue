<template>
  <base-layout>
    <section class="mb-4">
      <h1 class="h4 mb-2">Каталог курсов (Vue SPA)</h1>
      <p class="text-secondary mb-0">
        MVP ЛР3: каталог, авторизация по роли, страница курса и лекции из mock API.
      </p>
    </section>

    <section class="mb-3 row g-2">
      <div class="col-md-4">
        <label class="form-label small" for="filterQuery">Поиск</label>
        <input
          id="filterQuery"
          v-model.trim="filters.query"
          type="text"
          class="form-control form-control-sm"
          placeholder="Название курса"
        />
      </div>
      <div class="col-md-4">
        <label class="form-label small" for="filterCategory">Категория</label>
        <select id="filterCategory" v-model="filters.category" class="form-select form-select-sm">
          <option value="">Все</option>
          <option value="powerlifting">powerlifting</option>
          <option value="fitness">fitness</option>
          <option value="crossfit">crossfit</option>
        </select>
      </div>
      <div class="col-md-4">
        <label class="form-label small" for="filterMaxPrice">Макс. цена</label>
        <input
          id="filterMaxPrice"
          v-model.number="filters.maxPrice"
          type="number"
          min="0"
          class="form-control form-control-sm"
        />
      </div>
    </section>

    <div v-if="store.loading" class="alert alert-info">Загрузка курсов...</div>
    <div v-else-if="store.error" class="alert alert-danger">{{ store.error }}</div>
    <div v-else-if="!filteredCourses.length" class="alert alert-secondary">
      Нет курсов под текущие фильтры.
    </div>
    <div v-else class="row g-3">
      <div class="col-md-4" v-for="course in filteredCourses" :key="course.id">
        <course-card :course="course" />
      </div>
    </div>
  </base-layout>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import BaseLayout from '../layouts/BaseLayout.vue'
import CourseCard from '../components/CourseCard.vue'
import useCoursesStore from '../stores/courses'

const store = useCoursesStore()

const filters = reactive({
  query: '',
  category: '',
  maxPrice: null
})

const filteredCourses = computed(() => {
  return store.courses.filter((course) => {
    const byQuery = !filters.query || course.title.toLowerCase().includes(filters.query.toLowerCase())
    const byCategory = !filters.category || course.category === filters.category
    const byPrice = !filters.maxPrice || Number(course.price || 0) <= Number(filters.maxPrice)
    return byQuery && byCategory && byPrice
  })
})

onMounted(async () => {
  if (!store.courses.length) {
    await store.loadCourses()
  }
})
</script>
