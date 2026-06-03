<template>
  <div>
    <div class="bg-dark text-white py-3">
      <div class="container">
        <h1 class="h5 mb-2">Каталог моделей и датасетов</h1>
        <div class="row g-2" style="max-width:600px;">
          <div class="col">
            <input v-model="query" type="text" class="form-control" placeholder="Поиск..." @input="doSearch">
          </div>
          <div class="col-auto">
            <button class="btn btn-primary" @click="doSearch">Найти</button>
          </div>
        </div>
      </div>
    </div>

    <div class="container py-4">
      <div class="row g-4">
        <div class="col-lg-3">
          <div class="card p-3">
            <div class="d-flex justify-content-between mb-3">
              <h2 class="h6 mb-0 fw-bold">Фильтры</h2>
              <button class="btn btn-link btn-sm p-0" @click="clearFilters">Сбросить</button>
            </div>
            <div class="mb-3">
              <strong class="d-block mb-2" style="font-size:14px;">Тип</strong>
              <div v-for="t in ['all','model','dataset']" :key="t" class="form-check">
                <input class="form-check-input" type="radio" :id="'type-'+t" :value="t" v-model="typeFilter" @change="doSearch">
                <label class="form-check-label" :for="'type-'+t">{{ t === 'all' ? 'Все' : t === 'model' ? 'Модели' : 'Датасеты' }}</label>
              </div>
            </div>
            <div class="mb-3">
              <strong class="d-block mb-2" style="font-size:14px;">Задача</strong>
              <div v-for="task in tasks" :key="task" class="form-check">
                <input class="form-check-input" type="checkbox" :id="'task-'+task" :value="task" v-model="taskFilter" @change="doSearch">
                <label class="form-check-label" :for="'task-'+task">{{ task }}</label>
              </div>
            </div>
            <div class="mb-3">
              <label for="sortF" class="d-block mb-2" style="font-size:14px; font-weight:600;">Сортировка</label>
              <select id="sortF" class="form-select form-select-sm" v-model="sortBy" @change="doSearch">
                <option value="stars">По звёздам</option>
                <option value="downloads">По загрузкам</option>
                <option value="date">По дате</option>
              </select>
            </div>
          </div>
        </div>

        <div class="col-lg-9">
          <div class="mb-3">
            <small class="text-muted" aria-live="polite">Найдено: {{ results.length }}</small>
          </div>
          <div v-if="loading" class="text-muted">Загрузка...</div>
          <div v-else class="row g-3">
            <ModelCard v-for="m in results" :key="m.id" :model="m" col="col-md-6 col-xl-4" />
            <div v-if="results.length === 0" class="col-12">
              <p class="text-muted">Ничего не найдено.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '../composables/useApi.js'
import ModelCard from '../components/ModelCard.vue'

const route = useRoute()
const { getModels } = useApi()

const allModels = ref([])
const results = ref([])
const loading = ref(true)
const query = ref('')
const typeFilter = ref('all')
const taskFilter = ref([])
const sortBy = ref('stars')
const tasks = ['NLP', 'Computer Vision', 'Tabular', 'Audio', 'Multimodal']

function doSearch() {
  const q = query.value.toLowerCase()
  let res = allModels.value.filter(m => {
    if (typeFilter.value !== 'all' && m.type !== typeFilter.value) return false
    if (taskFilter.value.length && !taskFilter.value.includes(m.task)) return false
    if (q && !m.name.includes(q) && !m.desc.toLowerCase().includes(q)) return false
    return true
  })
  if (sortBy.value === 'stars') res.sort((a, b) => b.stars - a.stars)
  else if (sortBy.value === 'downloads') res.sort((a, b) => b.downloads - a.downloads)
  else res.sort((a, b) => b.date.localeCompare(a.date))
  results.value = res
}

function clearFilters() {
  query.value = ''
  typeFilter.value = 'all'
  taskFilter.value = []
  sortBy.value = 'stars'
  doSearch()
}

onMounted(async () => {
  try {
    allModels.value = await getModels()
  } catch {
    allModels.value = []
  } finally {
    loading.value = false
  }
  if (route.query.q) query.value = route.query.q
  if (route.query.task) taskFilter.value = [route.query.task]
  doSearch()
})
</script>
