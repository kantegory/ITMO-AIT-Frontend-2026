<template>
  <main id="main-content" role="main" class="container py-4 py-lg-5" tabindex="-1">
    <section class="hero p-4 p-lg-5 mb-4 fade-up">
      <div class="d-flex flex-wrap justify-content-between gap-3 align-items-center">
        <div>
          <h1 class="display-6 fw-bold mb-2">Управление рабочими</h1>
          <p class="text-secondary mb-0">Распределение задач, валидация результатов и мониторинг метрик качества.</p>
        </div>
        <button
          type="button"
          class="btn btn-brand"
          aria-label="Автораспределение задач"
          :disabled="autoAssigning"
          :aria-busy="autoAssigning ? 'true' : 'false'"
          @click="autoAssign"
        >
          {{ autoAssigning ? 'Распределяем...' : 'Автораспределение задач' }}
        </button>
      </div>
    </section>

    <section class="row g-4 mb-4" aria-label="Метрики команды">
      <div class="col-md-4 fade-up">
        <MetricCard label="Назначено задач" :value="summary?.assignedCount ?? null" />
      </div>
      <div class="col-md-4 fade-up fade-up-delay">
        <MetricCard label="Средний QA score" :value="summary ? formatPercent(summary.qaScore) : null" />
      </div>
      <div class="col-md-4 fade-up fade-up-delay-2">
        <MetricCard label="Ожидают валидации" :value="summary?.pendingValidation ?? null" />
      </div>
    </section>

    <section class="glass-card p-4">
      <h2 class="h4 mb-3">Команда</h2>
      <div class="table-responsive">
        <table class="table align-middle">
          <caption class="visually-hidden">Таблица команды с ролями, нагрузкой и качеством</caption>
          <thead>
            <tr>
              <th scope="col">Исполнитель</th>
              <th scope="col">Роль</th>
              <th scope="col">Текущая нагрузка</th>
              <th scope="col">Качество</th>
              <th scope="col">Действие</th>
            </tr>
          </thead>
          <tbody aria-live="polite">
            <tr v-if="error">
              <td colspan="5" class="text-danger">{{ error }}</td>
            </tr>
            <tr v-else-if="!workers.length">
              <td colspan="5" class="text-secondary">Загрузка команды...</td>
            </tr>
            <tr v-for="worker in workers" :key="worker.id">
              <th scope="row">{{ worker.name }}</th>
              <td>{{ worker.role }}</td>
              <td>{{ worker.currentLoad }} задач</td>
              <td><span :class="`badge text-bg-${qualityBadge(worker.quality)}`">{{ worker.quality }}%</span></td>
              <td><button class="btn btn-sm btn-outline-brand" type="button">{{ worker.actionLabel }}</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>

  <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1080">
    <div id="action-toast" class="toast align-items-center border-0" role="status" aria-live="polite" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">Задачи успешно распределены. Назначено +5 новых задач.</div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Закрыть"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Toast } from 'bootstrap'
import MetricCard from '../components/MetricCard.vue'
import { useApi } from '../composables/useApi'

const { get, patch } = useApi()

const workers = ref([])
const summary = ref(null)
const error = ref('')
const autoAssigning = ref(false)

function qualityBadge(value) {
  if (value >= 95) return 'success'
  if (value >= 90) return 'primary'
  return 'warning'
}

function formatPercent(value) {
  return `${Number(value).toFixed(1).replace('.0', '')}%`
}

onMounted(async () => {
  try {
    const [w, s] = await Promise.all([get('/workers'), get('/teamSummary/1')])
    workers.value = w
    summary.value = s
  } catch (err) {
    error.value = err.message
  }
})

async function autoAssign() {
  autoAssigning.value = true
  try {
    const [updatedSummary, ...updatedWorkers] = await Promise.all([
      patch('/teamSummary/1', {
        assignedCount: summary.value.assignedCount + 5,
        pendingValidation: summary.value.pendingValidation + 2,
      }),
      ...workers.value.slice(0, 3).map((worker, index) =>
        patch(`/workers/${worker.id}`, { currentLoad: worker.currentLoad + (index === 0 ? 2 : 1) })
      ),
    ])

    summary.value = updatedSummary
    workers.value = [...updatedWorkers, ...workers.value.slice(3)]

    Toast.getOrCreateInstance(document.getElementById('action-toast')).show()
  } catch (err) {
    alert(err.message)
  } finally {
    autoAssigning.value = false
  }
}
</script>
