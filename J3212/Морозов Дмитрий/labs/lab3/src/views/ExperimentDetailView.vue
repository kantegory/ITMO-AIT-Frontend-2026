<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';
import NotificationAlert from '../components/NotificationAlert.vue';
import { useNotifications } from '../composables/useNotifications';
import { api } from '../services/api';

const route = useRoute();
const router = useRouter();
const { notification, showNotification } = useNotifications();

const experiment = ref(null);
const activeTab = ref('logs');
const isDeleteModalOpen = ref(false);
const isCloneModalOpen = ref(false);
const cloneForm = reactive({ name: '', description: '' });

const statusClass = computed(() => {
  const map = {
    Completed: 'bg-success',
    Running: 'bg-warning text-dark',
    Failed: 'bg-danger',
    Pending: 'bg-secondary',
  };
  return map[experiment.value?.status] || 'bg-secondary';
});

async function loadExperiment() {
  const { data } = await api.get(`/experiments/${route.params.id}`);
  experiment.value = data;
  cloneForm.name = data.name ? `${data.name}_copy` : '';
}

async function deleteExperiment() {
  await api.delete(`/experiments/${route.params.id}`);
  showNotification('Эксперимент удалён', 'success');
  window.setTimeout(() => router.push('/experiments'), 800);
}

async function cloneExperiment() {
  if (!cloneForm.name.trim()) {
    showNotification('Введите название для клона', 'warning');
    return;
  }

  await api.post('/experiments', {
    name: cloneForm.name.trim(),
    description: cloneForm.description.trim(),
    date: new Date().toISOString().split('T')[0],
    metric: experiment.value?.metric || null,
    status: 'Pending',
    tags: experiment.value?.tags || [],
    logs: [`[INFO] Cloned from ${experiment.value?.name || 'unknown'}`],
    artifacts: [],
    params: experiment.value?.params || {},
    metrics: experiment.value?.metrics || { accuracy: null, loss: null },
  });

  showNotification('Эксперимент клонирован', 'success');
  window.setTimeout(() => router.push('/experiments'), 800);
}

onMounted(async () => {
  try {
    await loadExperiment();
  } catch {
    showNotification('Не удалось загрузить данные эксперимента', 'danger');
  }
});
</script>

<template>
  <section>
    <NotificationAlert :notification="notification" />

    <template v-if="experiment">
      <div class="d-flex justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1>{{ experiment.name }}</h1>
          <p class="text-muted mb-0">ID: {{ experiment.id }} · {{ experiment.date }}</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-primary" type="button" @click="isCloneModalOpen = true">Клонировать</button>
          <button class="btn btn-danger" type="button" @click="isDeleteModalOpen = true">Удалить</button>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <div class="card h-100"><div class="card-body">
            <h2 class="h6">Статус</h2>
            <span class="badge" :class="statusClass">{{ experiment.status }}</span>
          </div></div>
        </div>
        <div class="col-md-4">
          <div class="card h-100"><div class="card-body">
            <h2 class="h6">Accuracy</h2>
            <div class="stat-value">{{ experiment.metrics?.accuracy?.toFixed(2) || '—' }}</div>
          </div></div>
        </div>
        <div class="col-md-4">
          <div class="card h-100"><div class="card-body">
            <h2 class="h6">Loss</h2>
            <div class="stat-value">{{ experiment.metrics?.loss?.toFixed(2) || '—' }}</div>
          </div></div>
        </div>
      </div>

      <ul class="nav nav-pills mb-3">
        <li class="nav-item"><button class="nav-link" :class="{ active: activeTab === 'logs' }" @click="activeTab = 'logs'">Логи</button></li>
        <li class="nav-item"><button class="nav-link" :class="{ active: activeTab === 'artifacts' }" @click="activeTab = 'artifacts'">Артефакты</button></li>
        <li class="nav-item"><button class="nav-link" :class="{ active: activeTab === 'params' }" @click="activeTab = 'params'">Параметры</button></li>
      </ul>

      <div v-if="activeTab === 'logs'" class="log-panel">
        <div v-for="line in experiment.logs" :key="line">{{ line }}</div>
        <p v-if="!experiment.logs?.length" class="text-muted">Логи отсутствуют</p>
      </div>

      <div v-if="activeTab === 'artifacts'" class="table-responsive">
        <table class="table table-hover">
          <thead><tr><th>Название</th><th>Тип</th><th>Размер</th><th>Дата</th></tr></thead>
          <tbody>
            <tr v-for="artifact in experiment.artifacts" :key="`${artifact.name}-${artifact.date}`">
              <td>{{ artifact.name }}</td>
              <td>{{ artifact.type }}</td>
              <td>{{ artifact.size }}</td>
              <td>{{ artifact.date }}</td>
            </tr>
            <tr v-if="!experiment.artifacts?.length"><td colspan="4" class="text-center text-muted">Артефакты отсутствуют</td></tr>
          </tbody>
        </table>
      </div>

      <div v-if="activeTab === 'params'" class="table-responsive">
        <table class="table table-hover">
          <tbody>
            <tr v-for="(value, key) in experiment.params" :key="key">
              <th scope="row">{{ key }}</th>
              <td>{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <p v-else class="text-muted">Загрузка эксперимента...</p>

    <BaseModal v-model="isDeleteModalOpen" title="Удалить эксперимент">
      <p>Удалить эксперимент «{{ experiment?.name }}»? Это действие нельзя отменить.</p>
      <template #footer>
        <button class="btn btn-secondary" type="button" @click="isDeleteModalOpen = false">Отмена</button>
        <button class="btn btn-danger" type="button" @click="deleteExperiment">Удалить</button>
      </template>
    </BaseModal>

    <BaseModal v-model="isCloneModalOpen" title="Клонировать эксперимент">
      <div class="mb-3">
        <label class="form-label" for="clone-name">Название нового эксперимента</label>
        <input id="clone-name" v-model.trim="cloneForm.name" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label" for="clone-description">Описание</label>
        <textarea id="clone-description" v-model.trim="cloneForm.description" class="form-control" rows="3"></textarea>
      </div>
      <template #footer>
        <button class="btn btn-secondary" type="button" @click="isCloneModalOpen = false">Отмена</button>
        <button class="btn btn-primary" type="button" @click="cloneExperiment">Клонировать</button>
      </template>
    </BaseModal>
  </section>
</template>
