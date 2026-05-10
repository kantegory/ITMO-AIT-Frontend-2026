<template>
  <AppLayout>
    <header class="main-content__header flex-column align-items-start">
      <router-link to="/experiments" class="text-decoration-none mb-2">{{ t('expDetails.back') }}</router-link>
      <div class="d-flex justify-content-between w-100 align-items-center">
        <div>
          <h1 class="mb-1">{{ experiment?.name || t('common.loading') }}</h1>
          <span class="text-muted small">{{ experiment ? `${t('expDetails.started')} ${experiment.date}` : '' }}</span>
        </div>
        <span
          v-if="experiment"
          class="badge fs-5"
          :class="experiment.status === 'success' ? 'bg-success' : 'bg-warning text-dark'"
        >
          {{ experiment.status }}
        </span>
      </div>
    </header>

    <div v-if="loading" class="text-center py-5 text-muted">{{ t('common.loading') }}</div>

    <section v-else-if="experiment" class="content-panel">
      <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'metrics' }" @click="activeTab = 'metrics'">
            {{ t('expDetails.metricsTab') }}
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'logs' }" @click="activeTab = 'logs'">
            {{ t('expDetails.logsTab') }}
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'artifacts' }" @click="activeTab = 'artifacts'">
            {{ t('expDetails.artifactsTab') }}
          </button>
        </li>
      </ul>

      <div class="mt-4">
        <div v-if="activeTab === 'metrics'">
          <div class="row g-4 mb-4">
            <div class="col-md-4">
              <div class="card border-0 bg-light p-3">
                <h6 class="text-muted mb-1">{{ experiment.metricName || t('common.metric') }}</h6>
                <h3 class="mb-0 text-success">{{ experiment.metricValue }}</h3>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card border-0 bg-light p-3">
                <h6 class="text-muted mb-1">{{ t('expDetails.usedModel') }}</h6>
                <h3 class="mb-0">{{ experiment.model }}</h3>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card border-0 bg-light p-3">
                <h6 class="text-muted mb-1">{{ t('common.duration') }}</h6>
                <h3 class="mb-0">{{ experiment.duration || '-' }}</h3>
              </div>
            </div>
          </div>
          <h5>{{ t('expDetails.chartTitle') }}</h5>
          <div class="chart-placeholder d-flex justify-content-center align-items-center">
            <span class="text-muted">{{ t('expDetails.chartPlaceholder') }}</span>
          </div>
        </div>

        <div v-else-if="activeTab === 'logs'">
          <h5>{{ t('expDetails.consoleLogs') }}</h5>
          <pre class="console-log"><code>{{ logsText }}</code></pre>
        </div>

        <div v-else-if="activeTab === 'artifacts'">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5>{{ t('expDetails.modelFiles') }}</h5>
            <button class="btn btn-sm btn-outline-primary">{{ t('expDetails.downloadAll') }}</button>
          </div>
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div><strong>model_weights.pth</strong><br><small class="text-muted">Размер: 117 MB</small></div>
              <button class="btn btn-sm btn-primary">{{ t('expDetails.download') }}</button>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div><strong>config.yaml</strong><br><small class="text-muted">Размер: 4 KB</small></div>
              <button class="btn btn-sm btn-outline-secondary">{{ t('expDetails.view') }}</button>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div><strong>requirements.txt</strong><br><small class="text-muted">Размер: 1 KB</small></div>
              <button class="btn btn-sm btn-outline-secondary">{{ t('expDetails.view') }}</button>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import { useApi } from '../composables/useApi'
import { useLocale } from '../composables/useLocale'

const route = useRoute()
const router = useRouter()
const { getExperiment } = useApi()
const { t } = useLocale()

const experiment = ref(null)
const activeTab = ref('metrics')
const loading = ref(true)

const logsText = `[2026-02-27 16:18:01] Starting training process...
[2026-02-27 16:18:05] Loading dataset... Done
[2026-02-27 16:19:12] Epoch 1/150 - loss: 2.145 - acc: 45.1%
[2026-02-27 16:20:25] Epoch 2/150 - loss: 1.832 - acc: 52.4%
...
[2026-02-27 16:25:00] Epoch 150/150 - loss: 0.041 - acc: 92.3%
[2026-02-27 16:25:17] Training completed successfully.`

onMounted(async () => {
  try {
    const res = await getExperiment(route.params.id)
    experiment.value = res.data
  } catch {
    alert(t('expDetails.loadError'))
    router.push('/experiments')
  } finally {
    loading.value = false
  }
})
</script>
