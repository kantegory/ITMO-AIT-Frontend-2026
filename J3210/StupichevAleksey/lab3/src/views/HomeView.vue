<template>
  <main>
    <div class="container mt-4">
      <div class="filters-bar">
        <form class="row g-2 align-items-center" @submit.prevent="applyFilters">
          <div class="col-lg-4">
            <input
              v-model="filters.search"
              type="search"
              class="form-control"
              placeholder="Название курса, автор или предмет"
            />
          </div>
          <div class="col-lg-2">
            <select v-model="filters.language" class="form-select">
              <option value="">На любом языке</option>
              <option value="Русский">На русском</option>
              <option value="Английский">На английском</option>
            </select>
          </div>
          <div class="col-lg-auto">
            <div class="form-check">
              <input v-model="filters.hasCertificate" class="form-check-input" type="checkbox"
                     id="filterCert"/>
              <label class="form-check-label" for="filterCert">С сертификатами</label>
            </div>
          </div>
          <div class="col-lg-auto">
            <div class="form-check">
              <input v-model="filters.free" class="form-check-input" type="checkbox"
                     id="filterFree"/>
              <label class="form-check-label" for="filterFree">Бесплатные</label>
            </div>
          </div>
          <div class="col-lg-auto">
            <button class="btn btn-primary" type="submit">Искать</button>
            <button v-if="isFiltered" class="btn btn-outline-secondary ms-2" type="button"
                    @click="resetFilters">
              Сбросить
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="container pb-5">
      <template v-if="isFiltered">
        <h2 class="section-title mt-4">Результаты поиска</h2>
        <div v-if="isLoading" class="spinner-center">
          <div class="spinner-border text-primary"></div>
        </div>
        <div v-else-if="searchResults.length"
             class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          <CourseCard v-for="course in searchResults" :key="course.id" :course="course"/>
        </div>
        <p v-else class="text-muted">Ничего не найдено</p>
      </template>

      <template v-else>
        <h2 class="section-title mt-4">Топ-10 курсов</h2>
        <div v-if="isLoading" class="spinner-center">
          <div class="spinner-border text-primary"></div>
        </div>
        <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          <CourseCard v-for="course in topCourses" :key="course.id" :course="course"/>
        </div>

        <h2 class="section-title mt-5">Для новичков</h2>
        <div v-if="isLoading" class="spinner-center">
          <div class="spinner-border text-primary"></div>
        </div>
        <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          <CourseCard v-for="course in beginnerCourses" :key="course.id" :course="course"/>
        </div>
      </template>
    </div>
  </main>
</template>

<script setup>
import {ref, watch, onMounted} from 'vue'
import {coursesApi} from '@/api'
import CourseCard from '@/components/CourseCard.vue'

const props = defineProps({
  searchQuery: {type: String, default: ''},
})

const isLoading = ref(false)
const isFiltered = ref(false)

const topCourses = ref([])
const beginnerCourses = ref([])
const searchResults = ref([])

const filters = ref({
  search: '',
  language: '',
  hasCertificate: false,
  free: false,
})

async function loadDefault() {
  isLoading.value = true
  try {
    const [topRes, beginnerRes] = await Promise.all([
      coursesApi.getAll({isPublished: true, _sort: 'rating', _order: 'desc', _limit: 4}),
      coursesApi.getAll({isPublished: true, level: 'Начинающий', _limit: 4}),
    ])
    topCourses.value = topRes.data
    beginnerCourses.value = beginnerRes.data
  } finally {
    isLoading.value = false
  }
}

async function applyFilters() {
  const params = {isPublished: true}
  if (filters.value.search) params.q = filters.value.search
  if (filters.value.language) params.language = filters.value.language
  if (filters.value.hasCertificate) params.hasCertificate = true
  if (filters.value.free) params.price = 0

  isFiltered.value = Object.keys(params).length > 1

  if (!isFiltered.value) {
    await loadDefault()
    return
  }

  isLoading.value = true
  try {
    const {data} = await coursesApi.getAll(params)
    searchResults.value = data
  } finally {
    isLoading.value = false
  }
}

function resetFilters() {
  filters.value = {search: '', language: '', hasCertificate: false, free: false}
  isFiltered.value = false
  searchResults.value = []
  loadDefault()
}

watch(
  () => props.searchQuery,
  (q) => {
    if (q) {
      filters.value.search = q
      applyFilters()
    }
  }
)

onMounted(loadDefault)
</script>
