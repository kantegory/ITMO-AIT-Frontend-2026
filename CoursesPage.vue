<script setup>
import { onMounted } from 'vue'
import CourseCard from '../components/CourseCard.vue'
import { useCourses } from '../composables/useCourses'

const {
  loading,
  error,
  languageFilter,
  levelFilter,
  priceFilter,
  filteredCourses,
  loadCourses
} = useCourses()

onMounted(() => {
  loadCourses()
})
</script>

<template>
  <div class="container mt-5">
    <div class="mb-5">
      <h1>Каталог курсов</h1>
      <p class="text-muted">
        Выберите подходящий курс по языку, уровню и стоимости.
      </p>
    </div>

    <div class="card shadow-sm mb-5">
      <div class="card-body">
        <h4 class="mb-3">Фильтры</h4>

        <div class="row">
          <div class="col-md-4 mb-3">
            <label class="form-label">Язык</label>
            <select v-model="languageFilter" class="form-select">
              <option value="">Все языки</option>
              <option value="English">Английский</option>
              <option value="French">Французский</option>
              <option value="Spanish">Испанский</option>
              <option value="German">Немецкий</option>
            </select>
          </div>

          <div class="col-md-4 mb-3">
            <label class="form-label">Уровень</label>
            <select v-model="levelFilter" class="form-select">
              <option value="">Любой уровень</option>
              <option value="Beginner">Начальный</option>
              <option value="Intermediate">Средний</option>
            </select>
          </div>

          <div class="col-md-4 mb-3">
            <label class="form-label">Максимальная цена</label>
            <input
              v-model="priceFilter"
              type="number"
              class="form-control"
              placeholder="Например 3000"
            >
          </div>
        </div>
      </div>
    </div>

    <p v-if="loading">Загрузка курсов...</p>

    <p v-if="error" class="text-danger">
      {{ error }}
    </p>

    <div v-if="!loading && filteredCourses.length" class="row g-4">
      <div
        v-for="course in filteredCourses"
        :key="course.id"
        class="col-md-4"
      >
        <CourseCard :course="course" />
      </div>
    </div>

    <div
      v-if="!loading && filteredCourses.length === 0"
      class="alert alert-warning"
    >
      Курсы не найдены. Попробуйте изменить фильтры.
    </div>
  </div>
</template>