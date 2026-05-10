<template>
  <AppLayout>
    <header class="main-content__header">
      <h1>{{ t('models.title') }}</h1>
      <button class="btn btn-primary" @click="showNewModelModal = true" aria-haspopup="dialog">
        {{ t('models.register') }}
      </button>
    </header>

    <p class="text-muted mb-4">{{ t('models.description') }}</p>

    <section class="content-panel mb-4" :aria-label="t('models.searchSectionLabel')">
      <form class="filters-row" @submit.prevent="filterModels" role="search">
        <div class="filter-field filter-field--grow">
          <label for="modelSearch" class="form-label text-muted small">{{ t('models.searchLabel') }}</label>
          <input
              v-model="searchQuery"
              type="search"
              class="form-control"
              id="modelSearch"
              :placeholder="t('models.searchPlaceholder')"
              :aria-label="t('models.searchAriaLabel')"
          >
        </div>
        <div class="filter-field filter-field--btn">
          <button type="submit" class="btn btn-secondary">{{ t('models.searchBtn') }}</button>
        </div>
        <div v-if="searchQuery" class="filter-field filter-field--btn">
          <button type="button" class="btn btn-outline-secondary" @click="clearSearch" :aria-label="t('models.resetAriaLabel')">
            {{ t('models.resetBtn') }}
          </button>
        </div>
      </form>
    </section>

    <div
        v-if="filteredModels.length === 0"
        class="text-center text-muted py-4 content-panel"
        role="status"
        aria-live="polite"
    >
      {{ t('models.notFound') }}
    </div>

    <article
        v-for="(model, index) in filteredModels"
        :key="model.id"
        class="card mb-3 shadow-sm border-0 overflow-hidden"
        :aria-label="`Модель ${model.name}`"
    >
      <div class="card-header bg-white d-flex justify-content-between align-items-center">
        <div>
          <div class="d-flex align-items-center gap-2">
            <h2 class="mb-0 text-primary h5">{{ model.name }}</h2>
            <button
                class="btn btn-sm text-danger p-0 border-0"
                @click="handleDeleteModel(model.id)"
                :aria-label="`Удалить модель ${model.name}`"
            >🗑
            </button>
          </div>
          <small class="text-muted">{{ t('models.lastUpdated') }} {{ model.date || t('models.unknown') }}</small>
        </div>
        <button
            class="btn btn-outline-secondary btn-sm"
            type="button"
            @click="toggleVersions(index)"
            :aria-expanded="openIndexes.includes(index)"
            :aria-controls="`model-versions-${model.id}`"
        >
          {{ openIndexes.includes(index) ? t('models.hideVersions') : t('models.showVersions') }}
        </button>
      </div>

      <div
          v-if="openIndexes.includes(index)"
          :id="`model-versions-${model.id}`"
          class="card-body p-0"
      >
        <div class="table-responsive">
          <table class="table table-striped align-middle mb-0" :aria-label="`Версии модели ${model.name}`">
            <thead class="table-light">
            <tr>
              <th scope="col" class="col-version ps-4">{{ t('models.versionCol') }}</th>
              <th scope="col" class="col-stage">{{ t('models.stageCol') }}</th>
              <th scope="col" class="col-metrics">{{ t('models.metricsCol') }}</th>
              <th scope="col" class="col-action">{{ t('models.actionsCol') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="getVersions(model.name).length === 0">
              <td colspan="4" class="text-center p-3 text-muted">{{ t('models.noVersions') }}</td>
            </tr>
            <tr v-for="v in getVersions(model.name)" :key="v.id">
              <td class="ps-4">
                <div class="table-truncate">v{{ v.id }}</div>
              </td>
              <td>
                  <span class="badge" :class="v.status === 'success' ? 'bg-success' : 'bg-warning text-dark'">
                    {{ v.status }}
                  </span>
              </td>
              <td>Acc: {{ v.metricValue }}</td>
              <td>
                <router-link :to="`/experiments/${v.id}`" class="text-decoration-none">{{ t('models.details') }}</router-link>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </article>

    <NewModelModal
        :show="showNewModelModal"
        @close="showNewModelModal = false"
        @created="loadData"
    />
  </AppLayout>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import AppLayout from '../components/AppLayout.vue'
import NewModelModal from '../components/NewModelModal.vue'
import {useApi} from '../composables/useApi'
import {useAuth} from '../composables/useAuth'
import {useLocale} from '../composables/useLocale'

const {getModels, getExperiments, deleteModel} = useApi()
const {currentUser} = useAuth()
const {t} = useLocale()

const allModels = ref([])
const filteredModels = ref([])
const experiments = ref([])
const searchQuery = ref('')
const openIndexes = ref([])
const showNewModelModal = ref(false)

function getVersions(modelName) {
  return experiments.value.filter(e => e.model === modelName)
}

function toggleVersions(index) {
  const i = openIndexes.value.indexOf(index)
  if (i === -1) openIndexes.value.push(index)
  else openIndexes.value.splice(i, 1)
}

async function filterModels() {
  openIndexes.value = []
  const res = await getModels({userId: currentUser.value.id})
  const q = searchQuery.value.trim().toLowerCase()
  filteredModels.value = q
      ? res.data.filter(m => m.name.toLowerCase().includes(q))
      : res.data
  allModels.value = res.data
}

function clearSearch() {
  searchQuery.value = ''
  filteredModels.value = allModels.value
  openIndexes.value = []
}

async function handleDeleteModel(id) {
  if (confirm(t('models.deleteConfirm'))) {
    await deleteModel(id)
    await loadData()
  }
}

async function loadData() {
  const [modelsRes, expRes] = await Promise.all([
    getModels({userId: currentUser.value.id}),
    getExperiments({userId: currentUser.value.id}),
  ])
  allModels.value = modelsRes.data
  filteredModels.value = modelsRes.data
  experiments.value = expRes.data
  searchQuery.value = ''
  openIndexes.value = []
}

onMounted(loadData)
</script>

<style scoped>
.filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
}

.filter-field {
  min-width: 10px;
}

.filter-field--grow {
  flex: 1 1 200px;
}

.filter-field--btn {
  flex-shrink: 0;
}
</style>
