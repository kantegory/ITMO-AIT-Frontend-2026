<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchPipelineById } from '../api/pipelines';
import { fetchPipelineArtifacts } from '../api/profile';
import StatusBadge from '../components/StatusBadge.vue';
import StrategyBadge from '../components/StrategyBadge.vue';

const STATUS_LABELS = { success: 'Успешно', running: 'Запущен', failed: 'Ошибка', pending: 'Ожидание' };
const STRATEGY_LABELS = { bluegreen: 'Blue/Green', canary: 'Canary', rolling: 'Rolling' };

const STEPS = [
  { name: 'Тестирование', desc: 'Юнит-тесты, проверка зависимостей, линтинг кода', time: '3м 12с', badges: ['pytest: 142 passed', 'flake8: 0 errors'] },
  { name: 'Валидация модели', desc: 'Проверка метрик на тестовом датасете', time: '5м 48с', badges: ['accuracy: 0.934', 'F1: 0.912', 'latency: 45ms'] },
  { name: 'Упаковка', desc: 'Сборка Docker-образа, сохранение артефактов', time: '2м 15с', badges: [] },
  { name: 'Деплой', desc: 'Развертывание в целевую среду', time: '1м 19с', badges: [] }
];

const LOG_LINES = [
  '[10:14:01] Starting pipeline...',
  '[10:14:02] Step 1/4: Running tests...',
  '[10:14:03] Collecting tests from /tests/...',
  '[10:17:14] PASSED 142 tests in 3m 12s',
  '[10:17:15] Step 2/4: Validating model...',
  '[10:20:22] Model metrics: acc=0.934 f1=0.912 lat=45ms',
  '[10:23:03] PASSED All thresholds met',
  '[10:23:04] Step 3/4: Building package...',
  '[10:25:19] DONE Image pushed to registry',
  '[10:25:20] Step 4/4: Deploying...',
  '[10:26:02] Health check passed',
  '[10:26:39] SUCCESS Pipeline completed'
];

const route = useRoute();
const pipeline = ref(null);
const artifacts = ref([]);
const error = ref('');

const stepState = (i) => {
  if (!pipeline.value) return 'wait';
  if (i < pipeline.value.stepsDone) return 'done';
  if (pipeline.value.status === 'failed' && i === pipeline.value.stepsDone) return 'fail';
  return 'wait';
};

const infoRows = () => {
  const p = pipeline.value;
  if (!p) return [];
  return [
    ['Статус', STATUS_LABELS[p.status]],
    ['Среда', p.env],
    ['Стратегия', STRATEGY_LABELS[p.strategy] || p.strategy],
    ['Ветка', p.branch],
    ['Коммит', p.commit],
    ['Время', p.duration || '—'],
    ['Шаги', `${p.stepsDone}/${p.stepsTotal}`]
  ];
};

onMounted(async () => {
  try {
    const { data } = await fetchPipelineById(route.params.id);
    pipeline.value = data;
    document.title = `${data.name} — MLOps Deploy`;

    const artRes = await fetchPipelineArtifacts(data.id);
    artifacts.value = Array.isArray(artRes.data) ? artRes.data : [];
  } catch (err) {
    error.value = err.response?.status === 404 ? 'Пайплайн не найден' : err.message;
  }
});
</script>

<template>
  <main class="container my-4">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><RouterLink to="/pipelines">Пайплайны</RouterLink></li>
        <li class="breadcrumb-item active">{{ pipeline?.name || 'Загрузка...' }}</li>
      </ol>
    </nav>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <template v-else-if="pipeline">
      <div class="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 class="mb-1">{{ pipeline.name }}</h2>
          <p class="text-muted mb-0">
            <StatusBadge :status="pipeline.status" class="me-2" />
            <StrategyBadge :strategy="pipeline.strategy" class="me-2" />
            {{ pipeline.ownerName }} · {{ pipeline.env }} · ветка: {{ pipeline.branch }}
          </p>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-8">
          <h5 class="mb-3">Шаги пайплайна</h5>
          <div>
            <template v-for="(step, i) in STEPS" :key="i">
              <div v-if="i > 0" class="step-connector"></div>
              <div class="step-item">
                <div :class="['step-number', stepState(i)]">
                  <i v-if="stepState(i) === 'done'" class="bi bi-check"></i>
                  <i v-else-if="stepState(i) === 'fail'" class="bi bi-x"></i>
                  <template v-else>{{ i + 1 }}</template>
                </div>
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between">
                    <strong>{{ i + 1 }}. {{ step.name }}</strong>
                    <small v-if="stepState(i) === 'done'" class="text-muted">{{ step.time }}</small>
                  </div>
                  <small class="text-muted">{{ step.desc }}</small>
                  <div v-if="stepState(i) === 'done' && step.badges.length" class="mt-1">
                    <span v-for="b in step.badges" :key="b" class="badge bg-light text-dark me-1">{{ b }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <div class="mt-4">
            <h5 class="mb-3">Логи</h5>
            <div class="logs-container">
              <div v-for="line in LOG_LINES" :key="line">{{ line }}</div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="env-card">
            <h5>Информация</h5>
            <table class="table table-sm table-borderless mb-0">
              <tr v-for="[label, value] in infoRows()" :key="label">
                <td class="text-muted">{{ label }}</td>
                <td>{{ value }}</td>
              </tr>
            </table>
          </div>

          <div class="env-card">
            <h5>Артефакты</h5>
            <p v-if="artifacts.length === 0" class="text-muted small">Нет артефактов</p>
            <ul v-else class="list-unstyled mb-0">
              <li v-for="a in artifacts" :key="a.id" class="mb-2">
                <span style="color: var(--accent);">{{ a.name }}</span>
                <small class="text-muted d-block">{{ a.size }}{{ a.version ? ' · ' + a.version : '' }}</small>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>

<style scoped>
.logs-container {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 16px;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  max-height: 300px;
  overflow-y: auto;
  color: var(--text-secondary);
}
</style>
