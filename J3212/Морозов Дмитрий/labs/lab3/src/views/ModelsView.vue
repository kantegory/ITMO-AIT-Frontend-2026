<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';
import NotificationAlert from '../components/NotificationAlert.vue';
import PaginationControls from '../components/PaginationControls.vue';
import StatCard from '../components/StatCard.vue';
import { useNotifications } from '../composables/useNotifications';
import { usePagination } from '../composables/usePagination';
import { api } from '../services/api';

const { notification, showNotification } = useNotifications();
const models = ref([]);
const experiments = ref([]);
const selectedModel = ref(null);
const isAddModalOpen = ref(false);
const isInfoModalOpen = ref(false);
const isDeployModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const deployStatus = ref('Production');
const modelForm = reactive({
  name: '',
  version: '',
  experimentId: '',
  description: '',
  fileName: '',
});

const stats = computed(() => ({
  production: models.value.filter((model) => model.status === 'Production').length,
  staging: models.value.filter((model) => model.status === 'Staging').length,
  archived: models.value.filter((model) => model.status === 'Archived').length,
}));

const sortedModels = computed(() => [...models.value].sort((a, b) => new Date(b.date) - new Date(a.date)));
const { currentPage, totalPages, pageItems, goToPage } = usePagination(sortedModels, 6);

async function loadModels() {
  const { data } = await api.get('/models');
  models.value = data;
}

async function loadExperiments() {
  const { data } = await api.get('/experiments');
  experiments.value = data;
}

function openInfo(model) {
  selectedModel.value = model;
  isInfoModalOpen.value = true;
}

function openDeploy(model) {
  selectedModel.value = model;
  deployStatus.value = model.status || 'Production';
  isDeployModalOpen.value = true;
}

function openDelete(model) {
  selectedModel.value = model;
  isDeleteModalOpen.value = true;
}

function onFileChange(event) {
  modelForm.fileName = event.target.files?.[0]?.name || '';
}

async function addModel() {
  if (!modelForm.name.trim() || !modelForm.version.trim()) {
    showNotification('Заполните название и версию модели', 'warning');
    return;
  }

  const payload = {
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

  await api.post('/models', payload);

  if (payload.experimentId) {
    const { data: experiment } = await api.get(`/experiments/${payload.experimentId}`);
    await api.patch(`/experiments/${payload.experimentId}`, {
      logs: [...(experiment.logs || []), `[${new Date().toISOString()}] INFO: Model ${payload.name} ${payload.version} registered`],
      artifacts: [
        ...(experiment.artifacts || []),
        {
          name: payload.fileName || `${payload.name}_${payload.version}.pkl`,
          type: 'Model',
          size: 'N/A',
          date: payload.date,
        },
      ],
    });
  }

  Object.assign(modelForm, { name: '', version: '', experimentId: '', description: '', fileName: '' });
  isAddModalOpen.value = false;
  await loadModels();
  showNotification('Модель добавлена', 'success');
}

async function deployModel() {
  await api.patch(`/models/${selectedModel.value.id}`, { status: deployStatus.value });
  isDeployModalOpen.value = false;
  await loadModels();
  showNotification('Статус модели обновлён', 'success');
}

async function deleteModel() {
  await api.delete(`/models/${selectedModel.value.id}`);
  isDeleteModalOpen.value = false;
  await loadModels();
  showNotification('Модель удалена', 'success');
}

function statusClass(status) {
  return {
    Production: 'text-success',
    Staging: 'text-warning',
    Archived: 'text-secondary',
  }[status] || 'text-secondary';
}

onMounted(async () => {
  try {
    await Promise.all([loadModels(), loadExperiments()]);
  } catch {
    showNotification('Не удалось загрузить модели', 'danger');
  }
});
</script>

<template>
  <section>
    <div class="d-flex justify-content-between align-items-start mb-3">
      <div>
        <h1>Модели</h1>
        <p class="text-muted">Реестр обученных моделей</p>
      </div>
      <button class="btn btn-primary" type="button" @click="isAddModalOpen = true">Добавить модель</button>
    </div>

    <NotificationAlert :notification="notification" />

    <div class="row g-3 mb-4">
      <div class="col-md-4"><StatCard :value="stats.production" label="Production" tone="success" /></div>
      <div class="col-md-4"><StatCard :value="stats.staging" label="Staging" tone="warning" /></div>
      <div class="col-md-4"><StatCard :value="stats.archived" label="Archived" tone="info" /></div>
    </div>

    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Название</th>
            <th>Версия</th>
            <th>Статус</th>
            <th>Метрика</th>
            <th>Эксперимент</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="model in pageItems" :key="model.id">
            <td>{{ model.name }}</td>
            <td>{{ model.version }}</td>
            <td><span :class="statusClass(model.status)">{{ model.status }}</span></td>
            <td>{{ model.metric ? model.metric.toFixed(2) : '—' }}</td>
            <td>
              <RouterLink v-if="model.experimentId" :to="`/experiments/${model.experimentId}`">{{ model.experimentId }}</RouterLink>
              <span v-else>—</span>
            </td>
            <td>{{ model.date || '—' }}</td>
            <td>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-primary" type="button" @click="openDeploy(model)">Deploy</button>
                <button class="btn btn-sm btn-secondary" type="button" @click="openInfo(model)">View</button>
                <button class="btn btn-sm btn-danger" type="button" @click="openDelete(model)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <PaginationControls :current-page="currentPage" :total-pages="totalPages" @change="goToPage" />

    <BaseModal v-model="isAddModalOpen" title="Добавить модель">
      <div class="mb-3">
        <label class="form-label" for="model-name">Название модели</label>
        <input id="model-name" v-model.trim="modelForm.name" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label" for="model-version">Версия</label>
        <input id="model-version" v-model.trim="modelForm.version" class="form-control" placeholder="v1.0" />
      </div>
      <div class="mb-3">
        <label class="form-label" for="experiment-select">Эксперимент</label>
        <select id="experiment-select" v-model="modelForm.experimentId" class="form-select">
          <option value="">Без эксперимента</option>
          <option v-for="experiment in experiments" :key="experiment.id" :value="experiment.id">{{ experiment.name }}</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label" for="model-file">Файл модели</label>
        <input id="model-file" class="form-control" type="file" @change="onFileChange" />
      </div>
      <div class="mb-3">
        <label class="form-label" for="model-description">Описание</label>
        <textarea id="model-description" v-model.trim="modelForm.description" class="form-control" rows="3"></textarea>
      </div>
      <template #footer>
        <button class="btn btn-secondary" type="button" @click="isAddModalOpen = false">Отмена</button>
        <button class="btn btn-primary" type="button" @click="addModel">Добавить</button>
      </template>
    </BaseModal>

    <BaseModal v-model="isInfoModalOpen" title="Информация о модели">
      <template v-if="selectedModel">
        <table class="table table-sm">
          <tbody>
            <tr><th>Название</th><td>{{ selectedModel.name }}</td></tr>
            <tr><th>Версия</th><td>{{ selectedModel.version }}</td></tr>
            <tr><th>Статус</th><td>{{ selectedModel.status }}</td></tr>
            <tr><th>Accuracy</th><td>{{ selectedModel.metrics?.accuracy?.toFixed(2) || '—' }}</td></tr>
            <tr><th>Precision</th><td>{{ selectedModel.metrics?.precision?.toFixed(2) || '—' }}</td></tr>
            <tr><th>Recall</th><td>{{ selectedModel.metrics?.recall?.toFixed(2) || '—' }}</td></tr>
            <tr><th>F1</th><td>{{ selectedModel.metrics?.f1?.toFixed(3) || '—' }}</td></tr>
          </tbody>
        </table>
      </template>
    </BaseModal>

    <BaseModal v-model="isDeployModalOpen" title="Развернуть модель">
      <p v-if="selectedModel">Модель: {{ selectedModel.name }} {{ selectedModel.version }}</p>
      <label class="form-label" for="deploy-status">Новый статус</label>
      <select id="deploy-status" v-model="deployStatus" class="form-select">
        <option>Production</option>
        <option>Staging</option>
        <option>Archived</option>
      </select>
      <template #footer>
        <button class="btn btn-secondary" type="button" @click="isDeployModalOpen = false">Отмена</button>
        <button class="btn btn-primary" type="button" @click="deployModel">Сохранить</button>
      </template>
    </BaseModal>

    <BaseModal v-model="isDeleteModalOpen" title="Удалить модель">
      <p>Удалить модель «{{ selectedModel?.name }}»?</p>
      <template #footer>
        <button class="btn btn-secondary" type="button" @click="isDeleteModalOpen = false">Отмена</button>
        <button class="btn btn-danger" type="button" @click="deleteModel">Удалить</button>
      </template>
    </BaseModal>
  </section>
</template>
