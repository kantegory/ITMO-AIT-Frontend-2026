<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../api/api'
import CourseCard from '../components/CourseCard.vue'

const courses = ref([])
const loading = ref(false)

const search = ref('')
const levelFilter = ref('')
const priceFilter = ref('')

const loadCourses = async () => {
  try {
    loading.value = true
    const res = await api.get('/courses')
    courses.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadCourses)

const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    return (
      course.title.toLowerCase().includes(search.value.toLowerCase()) &&
      (levelFilter.value ? course.level === levelFilter.value : true) &&
      (priceFilter.value ? course.price <= priceFilter.value : true)
    )
  })
})
</script>

<template>
  <div class="container">

    <!-- HERO -->
    <div class="hero-box">
      <h1>Учиться легко вместе со SpeakEasy</h1>
      <p>
        Найди подходящий курс, выбери свой уровень и начни обучение уже сегодня.
      </p>
    </div>

    <!-- КУРСЫ -->
    <div class="mt-4">

      <h2>Популярные курсы</h2>

      <!-- ФИЛЬТР -->
      <div class="row mb-4">

        <div class="col-md-4 mb-2">
          <input
            v-model="search"
            type="text"
            class="form-control"
            placeholder="Поиск курса"
          >
        </div>

        <div class="col-md-4 mb-2">
          <select v-model="levelFilter" class="form-select">
            <option value="">Все уровни</option>
            <option value="Beginner">Начальный</option>
            <option value="Intermediate">Средний</option>
          </select>
        </div>

        <div class="col-md-4 mb-2">
          <input
            v-model="priceFilter"
            type="number"
            class="form-control"
            placeholder="Максимальная цена"
          >
        </div>

      </div>

      <!-- ЗАГРУЗКА -->
      <p v-if="loading">Загрузка...</p>

      <!-- КАРТОЧКИ -->
      <div v-if="!loading" class="row g-4">
        <div
          v-for="course in filteredCourses"
          :key="course.id"
          class="col-md-4"
        >
          <CourseCard :course="course" />
        </div>
      </div>

    </div>


  </div>
</template>