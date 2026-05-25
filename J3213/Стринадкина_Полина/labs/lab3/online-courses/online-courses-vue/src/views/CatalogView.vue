<script setup>
import { computed, ref } from 'vue'
import CourseCard from '../components/CourseCard.vue'
import { useCourses } from '../composables/useCourses'

const { courses, isLoading } = useCourses()

const searchQuery = ref('')
const categoryFilter = ref('')
const levelFilter = ref('')
const priceFilter = ref('')

const filteredCourses = computed(() => {
  return courses.value.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())

    const matchesCategory =
      !categoryFilter.value || course.category === categoryFilter.value

    const matchesLevel =
      !levelFilter.value || course.level === levelFilter.value

    const coursePrice = Number(String(course.price).replace(/\D/g, ''))

    const matchesPrice =
      !priceFilter.value ||
      (priceFilter.value === 'До 3000 ₽' && coursePrice <= 3000) ||
      (priceFilter.value === 'От 3000 ₽' && coursePrice >= 3000)

    return matchesSearch && matchesCategory && matchesLevel && matchesPrice
  })
})
</script>

<template>
  <main class="container py-5">
    <h1 class="mb-4">Каталог курсов</h1>

    <section class="mb-4">
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">Поиск</label>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Поиск курса"
          >
        </div>

        <div class="col-md-3">
          <label class="form-label">Категория</label>
          <select v-model="categoryFilter" class="form-select">
            <option value="">Все предметы</option>
            <option value="Frontend">Программирование</option>
            <option value="Design">Дизайн</option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label">Уровень</label>
          <select v-model="levelFilter" class="form-select">
            <option value="">Любой уровень</option>
            <option value="Начальный">Начальный</option>
            <option value="Средний">Средний</option>
            <option value="Продвинутый">Продвинутый</option>
          </select>
        </div>

        <div class="col-md-2">
          <label class="form-label">Цена</label>
          <select v-model="priceFilter" class="form-select">
            <option value="">Любая цена</option>
            <option value="До 3000 ₽">До 3000 ₽</option>
            <option value="От 3000 ₽">От 3000 ₽</option>
          </select>
        </div>
      </div>
    </section>

    <p v-if="isLoading">Загрузка...</p>

    <div v-else-if="filteredCourses.length" class="row g-4">
      <div
        v-for="course in filteredCourses"
        :key="course.id"
        class="col-md-4"
      >
        <CourseCard :course="course" />
      </div>
    </div>

    <div v-else class="alert alert-warning">
      Курсы не найдены.
    </div>
  </main>
</template>