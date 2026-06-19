<template>
  <AppLayout>
    <header class="main-content__header">
      <h1>{{ t('dashboard.title') }}</h1>
      <button type="button" class="btn btn-primary" @click="showNewExpModal = true" aria-haspopup="dialog">
        {{ t('dashboard.newExperiment') }}
      </button>
    </header>

    <section class="row mb-4">
      <div class="col-md-4">
        <div class="stat-card">
          <h2>{{ experiments.length }}</h2>
          <p>{{ t('dashboard.totalExperiments') }}</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="stat-card">
          <h2>{{ models.length }}</h2>
          <p>{{ t('dashboard.totalModels') }}</p>
        </div>
      </div>
    </section>

    <section class="recent-experiments content-panel">
      <h2>{{ t('dashboard.recentExperiments') }}</h2>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
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
            <tr v-for="exp in recentExperiments" :key="exp.id">
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
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-end mt-3">
        <router-link to="/experiments" class="btn btn-secondary btn-min-width">
          {{ t('dashboard.allExperiments') }}
        </router-link>
      </div>
    </section>

    <NewExperimentModal
      :show="showNewExpModal"
      :models="models"
      @close="showNewExpModal = false"
      @created="loadData"
    />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import NewExperimentModal from '../components/NewExperimentModal.vue'
import { useApi } from '../composables/useApi'
import { useAuth } from '../composables/useAuth'
import { useLocale } from '../composables/useLocale'

const { getExperiments, getModels, deleteExperiment } = useApi()
const { currentUser } = useAuth()
const { t } = useLocale()

const experiments = ref([])
const models = ref([])
const showNewExpModal = ref(false)

const recentExperiments = computed(() => [...experiments.value].reverse().slice(0, 6))

async function loadData() {
  const [expRes, modelsRes] = await Promise.all([
    getExperiments({ userId: currentUser.value.id }),
    getModels({ userId: currentUser.value.id }),
  ])
  experiments.value = expRes.data
  models.value = modelsRes.data
}

async function handleDeleteExp(id) {
  if (confirm(t('dashboard.deleteConfirm'))) {
    await deleteExperiment(id)
    await loadData()
  }
}

onMounted(loadData)
</script>
