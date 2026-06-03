<script setup>
import { ref, onMounted, computed } from 'vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
import CourseCard from '@/components/CourseCard.vue'
import { getCourses } from '@/api/courses'

const courses = ref([])
const loading = ref(true)

const formSearch = ref('')
const formCategory = ref('all')
const formLevel = ref('all')
const formMaxPrice = ref(10000)

const appliedSearch = ref('')
const appliedCategory = ref('all')
const appliedLevel = ref('all')
const appliedMaxPrice = ref(10000)

const fetchCourses = async () => {
  loading.value = true
  try {
    const response = await getCourses()
    courses.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  appliedSearch.value = formSearch.value
  appliedCategory.value = formCategory.value
  appliedLevel.value = formLevel.value
  appliedMaxPrice.value = formMaxPrice.value
}

const resetFilters = () => {
  formSearch.value = ''
  formCategory.value = 'all'
  formLevel.value = 'all'
  formMaxPrice.value = 10000
  applyFilters()
}

const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    const title = course.title || ''
    const price = course.price || 0
    const matchSearch = title.toLowerCase().includes(appliedSearch.value.toLowerCase())
    const matchCategory = appliedCategory.value === 'all' || course.category === appliedCategory.value
    const matchLevel = appliedLevel.value === 'all' || course.level === appliedLevel.value
    const matchPrice = price <= Number(appliedMaxPrice.value)
    return matchSearch && matchCategory && matchLevel && matchPrice
  })
})

onMounted(() => fetchCourses())
</script>

<template>
  <BaseLayout>
    <h1 class="text-white fw-bold mb-4">Каталог курсов</h1>

    <div class="filter-top-bar p-3 p-md-4 rounded-4 mb-4">
      <form class="row g-3 align-items-end" @submit.prevent="applyFilters">
        <div class="col-12 col-lg-3"><label class="form-label text-white-50 small mb-1">Поиск</label><input type="text" v-model="formSearch" class="form-control bg-dark text-white border-secondary" placeholder="Название курса..."></div>
        <div class="col-12 col-md-4 col-lg-2"><label class="form-label text-white-50 small mb-1">Направление</label><select v-model="formCategory" class="form-select bg-dark text-white border-secondary"><option value="all">Все</option><option value="lang">Языки</option><option value="data">Данные/ML</option><option value="math">Математика</option></select></div>
        <div class="col-12 col-md-4 col-lg-2"><label class="form-label text-white-50 small mb-1">Уровень</label><select v-model="formLevel" class="form-select bg-dark text-white border-secondary"><option value="all">Любой</option><option value="beginner">Новичок</option><option value="pro">Pro</option></select></div>
        <div class="col-12 col-md-4 col-lg-3"><label class="form-label text-white-50 small mb-1 d-flex justify-content-between"><span>Цена до:</span><span class="text-white fw-bold">{{ formMaxPrice }} ₽</span></label><input type="range" v-model.number="formMaxPrice" class="form-range custom-range" min="0" max="10000" step="500"></div>
        <div class="col-12 col-lg-2 d-flex gap-2">
          <button type="button" @click="resetFilters" class="btn btn-outline-light w-50 fw-bold">Сброс</button>
          <button type="submit" class="btn btn-neon w-50 fw-bold">Найти</button>
        </div>
      </form>
    </div>

    <div v-if="loading" class="text-center py-5"><div class="spinner-border text-neon" role="status"></div></div>
    <div v-else-if="filteredCourses.length === 0" class="col-12 d-flex justify-content-center align-items-center" style="min-height: 200px;"><h4 class="text-white-50 text-center">По вашему запросу ничего не найдено</h4></div>
    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4"><CourseCard v-for="course in filteredCourses" :key="course.id" :course="course" /></div>
  </BaseLayout>
</template>