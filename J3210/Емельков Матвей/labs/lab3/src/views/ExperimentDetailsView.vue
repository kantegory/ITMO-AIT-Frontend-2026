<template>
  <AppLayout>
    <header class="main-content__header flex-column align-items-start">
      <router-link to="/experiments" class="text-decoration-none mb-2">← Назад к списку</router-link>
      <div class="d-flex justify-content-between w-100 align-items-center">
        <div>
          <h1 class="mb-1">{{ experiment?.name || 'Загрузка...' }}</h1>
          <span class="text-muted small">{{ experiment ? `Запущен: ${experiment.date}` : '' }}</span>
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

    <div v-if="loading" class="text-center py-5 text-muted">Загрузка...</div>

    <section v-else-if="experiment" class="content-panel">
      <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'metrics' }" @click="activeTab = 'metrics'">
            Метрики
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'logs' }" @click="activeTab = 'logs'">
            Логи обучения
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'artifacts' }" @click="activeTab = 'artifacts'">
            Файлы и артефакты
          </button>
        </li>
      </ul>

      <div class="mt-4">
        <div v-if="activeTab === 'metrics'">
          <div class="row g-4 mb-4">
            <div class="col-md-4">
              <div class="card border-0 bg-light p-3">
                <h6 class="text-muted mb-1">{{ experiment.metricName || 'Метрика' }}</h6>
                <h3 class="mb-0 text-success">{{ experiment.metricValue }}</h3>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card border-0 bg-light p-3">
                <h6 class="text-muted mb-1">Используемая модель</h6>
                <h3 class="mb-0">{{ experiment.model }}</h3>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card border-0 bg-light p-3">
                <h6 class="text-muted mb-1">Длительность</h6>
                <h3 class="mb-0">{{ experiment.duration || '-' }}</h3>
              </div>
            </div>
          </div>
          <h5>Визуализация обучения</h5>
          <div class="chart-placeholder d-flex justify-content-center align-items-center">
            <span class="text-muted">Здесь будет график</span>
          </div>
        </div>

        <div v-else-if="activeTab === 'logs'">
          <h5>Вывод консоли</h5>
          <pre class="console-log"><code>{{ logsText }}</code></pre>
        </div>

        <div v-else-if="activeTab === 'artifacts'">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5>Файлы модели</h5>
            <button class="btn btn-sm btn-outline-primary">Скачать всё (.zip)</button>
          </div>
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div><strong>model_weights.pth</strong><br><small class="text-muted">Размер: 117 MB</small></div>
              <button class="btn btn-sm btn-primary">Скачать</button>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div><strong>config.yaml</strong><br><small class="text-muted">Размер: 4 KB</small></div>
              <button class="btn btn-sm btn-outline-secondary">Посмотреть</button>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div><strong>requirements.txt</strong><br><small class="text-muted">Размер: 1 KB</small></div>
              <button class="btn btn-sm btn-outline-secondary">Посмотреть</button>
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

const route = useRoute()
const router = useRouter()
const { getExperiment } = useApi()

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
    alert('Не удалось загрузить данные эксперимента.')
    router.push('/experiments')
  } finally {
    loading.value = false
  }
})
</script>
