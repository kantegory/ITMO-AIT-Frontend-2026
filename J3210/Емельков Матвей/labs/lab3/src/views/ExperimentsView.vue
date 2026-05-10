<template>
  <AppLayout>
    <header class="main-content__header">
      <h1>{{ t('experiments.title') }}</h1>
      <button type="button" class="btn btn-primary" @click="showNewExpModal = true" aria-haspopup="dialog">
        {{ t('dashboard.newExperiment') }}
      </button>
    </header>

    <section class="content-panel" :aria-label="t('experiments.filtersLabel')">
      <form class="filters-row" @submit.prevent="applyFilters" role="search">
        <div class="filter-field filter-field--grow">
          <label for="searchInput" class="form-label text-muted small">{{ t('experiments.searchLabel') }}</label>
          <input
            v-model="filters.name"
            type="search"
            class="form-control"
            id="searchInput"
            :placeholder="t('experiments.searchPlaceholder')"
            :aria-label="t('experiments.searchAriaLabel')"
          >
        </div>
        <div class="filter-field">
          <label for="dateFilter" class="form-label text-muted small">{{ t('experiments.dateLabel') }}</label>
          <input
            v-model="filters.date"
            type="date"
            class="form-control"
            id="dateFilter"
            :key="locale"
            :aria-label="t('experiments.dateAriaLabel')"
          >
        </div>
        <div class="filter-field">
          <label for="metricFilter" class="form-label text-muted small">{{ t('experiments.metricLabel') }}</label>
          <select
            v-model="filters.metricOrder"
            class="form-select"
            id="metricFilter"
            :aria-label="t('experiments.metricAriaLabel')"
          >
            <option value="">{{ t('experiments.noSort') }}</option>
            <option value="desc">{{ t('experiments.sortDesc') }}</option>
            <option value="asc">{{ t('experiments.sortAsc') }}</option>
          </select>
        </div>
        <div class="filter-field filter-field--btn">
          <button type="submit" class="btn btn-secondary w-100">{{ t('experiments.apply') }}</button>
        </div>
      </form>
    </section>

    <section class="content-panel" :aria-label="t('experiments.tableLabel')">
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th scope="col">{{ t('common.name') }}</th>
              <th scope="col">{{ t('common.model') }}</th>
              <th scope="col">{{ t('common.metric') }}</th>
              <th scope="col">{{ t('common.metricValue') }}</th>
              <th scope="col">{{ t('common.date') }}</th>
              <th scope="col">{{ t('common.duration') }}</th>
              <th scope="col">{{ t('common.status') }}</th>
              <th scope="col"><span class="visually-hidden">{{ t('common.actions') }}</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="exp in displayedExperiments" :key="exp.id">
              <td>
                <router-link :to="`/experiments/${exp.id}`" class="text-decoration-none text-truncate btn-min-width">
                  {{ exp.name }}
                </router-link>
              </td>
              <td><span class="badge bg-secondary text-truncate btn-min-width">{{ exp.model }}</span></td>
              <td>{{ exp.metricName }}</td>
              <td>{{ exp.metricValue }}</td>
              <td>{{ exp.date }}</td>
              <td>{{ exp.duration || '-' }}</td>
              <td>
                <span class="badge" :class="exp.status === 'success' ? 'bg-success' : 'bg-warning text-dark'">
                  {{ exp.status }}
                </span>
              </td>
              <td>
                <button
                  class="btn btn-sm text-danger"
                  @click="handleDeleteExp(exp.id)"
                  :aria-label="`Удалить эксперимент ${exp.name}`"
                >🗑</button>
              </td>
            </tr>
            <tr v-if="displayedExperiments.length === 0">
              <td
                colspan="8"
                class="text-center text-muted py-3"
                role="status"
                aria-live="polite"
              >{{ t('experiments.notFound') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <NewExperimentModal
      :show="showNewExpModal"
      :models="models"
      @close="showNewExpModal = false"
      @created="applyFilters"
    />
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import NewExperimentModal from '../components/NewExperimentModal.vue'
import { useApi } from '../composables/useApi'
import { useAuth } from '../composables/useAuth'
import { useLocale } from '../composables/useLocale'

const { getExperiments, getModels, deleteExperiment } = useApi()
const { currentUser } = useAuth()
const { t, locale } = useLocale()

const displayedExperiments = ref([])
const models = ref([])
const showNewExpModal = ref(false)

const filters = ref({ name: '', date: '', metricOrder: '' })

function parseDate(dateStr) {
  if (!dateStr) return null
  const match = dateStr.match(/^(\d{1,2})\.(\d{2})\.(\d{4})/)
  if (match) return new Date(+match[3], +match[2] - 1, +match[1])
  const d = new Date(dateStr)
  return isNaN(d) ? null : d
}

async function applyFilters() {
  const res = await getExperiments({ userId: currentUser.value.id })
  let result = res.data

  if (filters.value.name.trim()) {
    const q = filters.value.name.trim().toLowerCase()
    result = result.filter(exp => exp.name.toLowerCase().includes(q))
  }

  if (filters.value.date) {
    const filterDate = new Date(filters.value.date)
    result = result.filter(exp => {
      const d = parseDate(exp.date)
      return d && d.toDateString() === filterDate.toDateString()
    })
  }

  if (filters.value.metricOrder) {
    result = [...result].sort((a, b) => {
      const av = parseFloat(a.metricValue) || 0
      const bv = parseFloat(b.metricValue) || 0
      return filters.value.metricOrder === 'desc' ? bv - av : av - bv
    })
  }

  displayedExperiments.value = result
}

async function handleDeleteExp(id) {
  if (confirm(t('experiments.deleteConfirm'))) {
    await deleteExperiment(id)
    await applyFilters()
  }
}

onMounted(async () => {
  const modelsRes = await getModels({ userId: currentUser.value.id })
  models.value = modelsRes.data
  await applyFilters()
})
</script>

<style scoped>
.filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
}

.filter-field {
  min-width: 140px;
}

.filter-field--grow {
  flex: 1 1 180px;
}

.filter-field--btn {
  flex-shrink: 0;
}
</style>
