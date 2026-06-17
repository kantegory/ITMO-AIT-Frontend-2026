<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';
import NotificationAlert from '../components/NotificationAlert.vue';
import StatCard from '../components/StatCard.vue';
import { useExperiments } from '../composables/useExperiments';
import { useNotifications } from '../composables/useNotifications';
import { api } from '../services/api';

const { experiments, loadExperiments, createExperiment } = useExperiments();
const { notification, showNotification } = useNotifications();

const models = ref([]);
const isExperimentModalOpen = ref(false);
const isModelModalOpen = ref(false);
const experimentForm = reactive({ name: '', modelType: 'Scikit-learn' });
const modelForm = reactive({
  name: '',
  version: '',
  experimentId: '',
  description: '',
  fileName: '',
});

const stats = computed(() => ({
  total: experiments.value.length,
  models: models.value.length,
  running: experiments.value.filter((experiment) => experiment.status === 'Running').length,
  files: experiments.value.reduce((sum, experiment) => sum + (experiment.artifacts?.length || 0), 0),
}));

const recentExperiments = computed(() =>
  [...experiments.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4),
);

async function loadModels() {
  const { data } = await api.get('/models');
  models.value = data;
}

async function submitExperiment() {
  if (!experimentForm.name.trim()) {
    showNotification('Введите название эксперимента', 'warning');
    return;
  }

  await createExperiment({
    name: experimentForm.name.trim(),
    modelType: experimentForm.modelType,
  });

  experimentForm.name = '';
  isExperimentModalOpen.value = false;
  showNotification('Эксперимент создан', 'success');
}

async function submitModel() {
  if (!modelForm.name.trim() || !modelForm.version.trim()) {
    showNotification('Заполните название и версию модели', 'warning');
    return;
  }

  const modelPayload = {
    name: modelForm.name.trim(),
    version: modelForm.version.trim(),
    experimentId: modelForm.experimentId || null,
    description: modelForm.description.trim(),
    fileName: modelForm.fileName || null,
    fileSize: null,
    status: 'Staging',
    metric: 0,
    date: new Date().toISOString().split('T')[0],
    metrics: { accuracy: 0, precision: 0, recall: 0, f1: 0 },
  };

  await api.post('/models', modelPayload);

  if (modelForm.experimentId) {
    const { data: experiment } = await api.get(`/experiments/${modelForm.experimentId}`);
    await api.patch(`/experiments/${modelForm.experimentId}`, {
      logs: [...(experiment.logs || []), `[${new Date().toISOString()}] INFO: Model ${modelPayload.name} ${modelPayload.version} registered`],
      artifacts: [
        ...(experiment.artifacts || []),
        {
          name: modelForm.fileName || `${modelPayload.name}_${modelPayload.version}.pkl`,
          type: 'Model',
          size: 'N/A',
          date: modelPayload.date,
        },
      ],
    });
  }

  Object.assign(modelForm, { name: '', version: '', experimentId: '', description: '', fileName: '' });
  isModelModalOpen.value = false;
  await Promise.all([loadModels(), loadExperiments()]);
  showNotification('Модель добавлена', 'success');
}

function onFileChange(event) {
  modelForm.fileName = event.target.files?.[0]?.name || '';
}

function downloadStats() {
  const content = [
    'ML Pipeline — Статистика дашборда',
    `Дата выгрузки: ${new Date().toLocaleString('ru-RU')}`,
    `Пользователь: ${localStorage.getItem('userEmail') || 'Не авторизован'}`,
    '',
    `Всего экспериментов: ${stats.value.total}`,
    `Моделей в реестре: ${stats.value.models}`,
    `Запущено сейчас: ${stats.value.running}`,
    `Файлов сохранено: ${stats.value.files}`,
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `ml-stats-${new Date().toISOString().split('T')[0]}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
}

onMounted(async () => {
  try {
    await Promise.all([loadExperiments(), loadModels()]);
  } catch {
    showNotification('Не удалось загрузить данные дашборда', 'danger');
  }
});
</script>

<template>
  <section>
    <h1>Личный кабинет</h1>
    <p class="text-muted">Обзор ваших ML-экспериментов и моделей</p>
    <NotificationAlert :notification="notification" />

    <div class="row g-3 mb-4">
      <div class="col-md-3"><StatCard :value="stats.total" label="Всего запущено" tone="primary" /></div>
      <div class="col-md-3"><StatCard :value="stats.models" label="В реестре" tone="success" /></div>
      <div class="col-md-3"><StatCard :value="stats.running" label="Запущено сейчас" tone="warning" /></div>
      <div class="col-md-3"><StatCard :value="stats.files" label="Файлов сохранено" tone="info" /></div>
    </div>

    <section class="mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 mb-0">Последние эксперименты</h2>
        <RouterLink to="/experiments" class="btn btn-primary">Все эксперименты</RouterLink>
      </div>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Название</th>
              <th>Дата</th>
              <th>Метрика</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="experiment in recentExperiments" :key="experiment.id">
              <td><RouterLink :to="`/experiments/${experiment.id}`">{{ experiment.name }}</RouterLink></td>
              <td>{{ experiment.date }}</td>
              <td>{{ experiment.metric ? `${experiment.metric.toFixed(2)} acc` : '—' }}</td>
              <td>{{ experiment.status }}</td>
              <td><RouterLink class="btn btn-sm btn-primary" :to="`/experiments/${experiment.id}`">Просмотр</RouterLink></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 class="h5">Быстрые действия</h2>
      <div class="row g-3">
        <div class="col-md-4">
          <div class="card h-100"><div class="card-body">
            <h3 class="h6">Новый эксперимент</h3>
            <p class="text-muted">Запустить обучение модели</p>
            <button class="btn btn-primary" type="button" @click="isExperimentModalOpen = true">Создать</button>
          </div></div>
        </div>
        <div class="col-md-4">
          <div class="card h-100"><div class="card-body">
            <h3 class="h6">Загрузить модель</h3>
            <p class="text-muted">Добавить в реестр</p>
            <button class="btn btn-primary" type="button" @click="isModelModalOpen = true">Загрузить</button>
          </div></div>
        </div>
        <div class="col-md-4">
          <div class="card h-100"><div class="card-body">
            <h3 class="h6">Отчёты</h3>
            <p class="text-muted">Скачать статистику</p>
            <button class="btn btn-primary" type="button" @click="downloadStats">Скачать</button>
          </div></div>
        </div>
      </div>
    </section>

    <BaseModal v-model="isExperimentModalOpen" title="Новый эксперимент">
      <div class="mb-3">
        <label class="form-label" for="experiment-name">Название эксперимента</label>
        <input id="experiment-name" v-model.trim="experimentForm.name" class="form-control" placeholder="model_v4_training" />
      </div>
      <div class="mb-3">
        <label class="form-label" for="model-type">Тип модели</label>
        <select id="model-type" v-model="experimentForm.modelType" class="form-select">
          <option>Scikit-learn</option>
          <option>PyTorch</option>
          <option>TensorFlow</option>
        </select>
      </div>
      <template #footer>
        <button class="btn btn-secondary" type="button" @click="isExperimentModalOpen = false">Отмена</button>
        <button class="btn btn-primary" type="button" @click="submitExperiment">Запустить</button>
      </template>
    </BaseModal>

    <BaseModal v-model="isModelModalOpen" title="Загрузить модель">
      <div class="mb-3">
        <label class="form-label" for="upload-model-name">Название модели</label>
        <input id="upload-model-name" v-model.trim="modelForm.name" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label" for="upload-model-version">Версия</label>
        <input id="upload-model-version" v-model.trim="modelForm.version" class="form-control" placeholder="v1.0" />
      </div>
      <div class="mb-3">
        <label class="form-label" for="upload-experiment">Эксперимент</label>
        <select id="upload-experiment" v-model="modelForm.experimentId" class="form-select">
          <option value="">Без эксперимента</option>
          <option v-for="experiment in experiments" :key="experiment.id" :value="experiment.id">{{ experiment.name }}</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label" for="upload-file">Файл модели</label>
        <input id="upload-file" class="form-control" type="file" @change="onFileChange" />
      </div>
      <div class="mb-3">
        <label class="form-label" for="upload-description">Описание</label>
        <textarea id="upload-description" v-model.trim="modelForm.description" class="form-control" rows="3"></textarea>
      </div>
      <template #footer>
        <button class="btn btn-secondary" type="button" @click="isModelModalOpen = false">Отмена</button>
        <button class="btn btn-primary" type="button" @click="submitModel">Загрузить</button>
      </template>
    </BaseModal>
  </section>
</template>
