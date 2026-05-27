<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import AppAlert from '../components/AppAlert.vue'
import ModelCard from '../components/ModelCard.vue'
import { useApi } from '../composables/useApi'

const { get } = useApi()

const state = reactive({
  models: []
})

const draftFilters = reactive({
  query: '',
  task: 'Любая',
  size: 'Любой',
  framework: 'Любой',
  sort: 'popular'
})

const appliedFilters = reactive({
  query: '',
  task: 'Любая',
  size: 'Любой',
  framework: 'Любой',
  sort: 'popular'
})

const loading = ref(false)
const message = ref('')
const messageType = ref('info')

function setMessage(text, type = 'info') {
  message.value = text
  messageType.value = type
}

function applyFilters() {
  appliedFilters.query = draftFilters.query.trim().toLowerCase()
  appliedFilters.task = draftFilters.task
  appliedFilters.size = draftFilters.size
  appliedFilters.framework = draftFilters.framework
  appliedFilters.sort = draftFilters.sort
}

const filteredModels = computed(() => {
  let filtered = state.models.filter((model) => {
    const haystack = `${model.title} ${model.description} ${model.task} ${model.framework}`.toLowerCase()
    const byQuery = !appliedFilters.query || haystack.includes(appliedFilters.query)
    const byTask = appliedFilters.task === 'Любая' || model.task === appliedFilters.task
    const bySize = appliedFilters.size === 'Любой' || model.size === appliedFilters.size
    const byFramework = appliedFilters.framework === 'Любой' || model.framework === appliedFilters.framework
    return byQuery && byTask && bySize && byFramework
  })

  if (appliedFilters.sort === 'new') {
    filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else {
    filtered = [...filtered].sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
  }

  return filtered
})

const chips = computed(() => {
  const items = []

  if (appliedFilters.task !== 'Любая') items.push(appliedFilters.task)
  if (appliedFilters.framework !== 'Любой') items.push(appliedFilters.framework)
  if (appliedFilters.size !== 'Любой') items.push(appliedFilters.size)
  if (appliedFilters.query) items.push(`Запрос: ${appliedFilters.query}`)

  return items.length ? items : ['Без фильтров']
})

async function loadModels() {
  setMessage('')
  loading.value = true

  try {
    state.models = await get('/models')
    applyFilters()
  } catch (error) {
    setMessage(error.message || 'Не удалось загрузить модели', 'danger')
  } finally {
    loading.value = false
  }
}

onMounted(loadModels)
</script>

<template>
  <div class="row g-4">
    <div class="col-lg-4 col-xl-3">
      <aside class="hub-card p-4 filter-panel" aria-labelledby="filtersTitle">
        <h2 id="filtersTitle" class="section-title">Фильтры</h2>

        <div class="mb-3">
          <label for="searchInput" class="form-label">Поиск</label>
          <input
            id="searchInput"
            v-model="draftFilters.query"
            class="form-control"
            type="text"
            placeholder="Название, задача, фреймворк"
            @keydown.enter.prevent="applyFilters"
          >
        </div>

        <div class="mb-3">
          <label for="task" class="form-label">Задача</label>
          <select id="task" v-model="draftFilters.task" class="form-select">
            <option>Любая</option>
            <option>NLP</option>
            <option>Computer Vision</option>
            <option>Time Series</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="size" class="form-label">Размер</label>
          <select id="size" v-model="draftFilters.size" class="form-select">
            <option>Любой</option>
            <option>До 1 GB</option>
            <option>1 - 16 GB</option>
            <option>16 - 64 GB</option>
            <option>64+ GB</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="framework" class="form-label">Фреймворк</label>
          <select id="framework" v-model="draftFilters.framework" class="form-select">
            <option>Любой</option>
            <option>PyTorch</option>
            <option>TensorFlow</option>
          </select>
        </div>

        <button class="btn btn-primary w-100" type="button" @click="applyFilters">Применить фильтры</button>
      </aside>
    </div>

    <div class="col-lg-8 col-xl-9">
      <section class="hub-card p-4 p-md-5">
        <AppAlert :type="messageType" :message="message" />

        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h1 class="section-title mb-0">Найдено {{ filteredModels.length }} результат(ов)</h1>
          <select v-model="draftFilters.sort" class="form-select w-auto" @change="applyFilters">
            <option value="popular">Популярные</option>
            <option value="new">Новые</option>
          </select>
        </div>

        <div class="mb-4" aria-label="Активные фильтры">
          <span v-for="chip in chips" :key="chip" class="chip">{{ chip }}</span>
        </div>

        <p v-if="loading" class="muted mb-0">Загрузка моделей...</p>

        <section v-else-if="filteredModels.length" role="list" aria-label="Результаты поиска моделей">
          <ModelCard v-for="model in filteredModels" :key="model.id" :model="model" />
        </section>

        <div v-else class="hub-card p-4">
          <p class="mb-0 muted">Ничего не найдено по выбранным фильтрам.</p>
        </div>
      </section>
    </div>
  </div>
</template>
