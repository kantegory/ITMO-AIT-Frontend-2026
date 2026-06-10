<template>
  <AppLayout title="Dashboard">
    <template #topbar>
      <div class="dropdown ms-auto">
        <button class="btn btn-primary position-relative dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <IconSprite class="me-1" name="icon-bell" size="sm" />
          Уведомления
          <span v-if="unreadNotifications.length" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {{ unreadNotifications.length }}
          </span>
        </button>
        <section class="dropdown-menu dropdown-menu-end notification-menu p-0" aria-label="Уведомления">
          <header class="dropdown-header d-flex justify-content-between align-items-center">
            <span>Уведомления</span>
            <button v-if="unreadNotifications.length" class="btn btn-sm btn-link p-0" type="button" @click="markNotificationsRead">
              Прочитать
            </button>
          </header>
          <ul class="list-group list-group-flush">
            <li v-if="!notifications.length" class="list-group-item small text-secondary">Нет уведомлений</li>
            <li v-for="item in notifications" :key="item.id" class="list-group-item small" :class="{ read: item.read }">
              <StatusBadge :status="item.severity" />
              <span class="ms-2">{{ item.text }}</span>
            </li>
          </ul>
          <footer class="border-top p-2 text-end">
            <RouterLink class="btn btn-sm btn-outline-secondary" to="/monitoring">Monitoring</RouterLink>
          </footer>
        </section>
      </div>
      <p class="mb-0 fw-medium ms-3">{{ user?.name || 'User' }}</p>
    </template>

    <section class="mb-4">
      <h1 class="h4 mb-1">Здравствуйте, {{ firstName }}</h1>
      <p class="text-secondary mb-0">Обзор ETL-экосистемы за последние 24 часа</p>
    </section>

    <section class="row g-3 mb-4" aria-label="Сводная статистика">
      <div v-for="stat in stats" :key="stat.label" class="col-12 col-sm-6 col-xl">
        <StatCard :label="stat.label" :value="stat.value" />
      </div>
    </section>

    <section class="card mb-4" aria-labelledby="myDagsHeading">
      <header class="card-header bg-white d-flex justify-content-between align-items-center">
        <h2 id="myDagsHeading" class="h6 mb-0">Мои DAG'и</h2>
        <RouterLink class="btn btn-sm btn-outline-primary" to="/pipelines">Все пайплайны</RouterLink>
      </header>
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Last run</th>
              <th>Next run</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pipeline in pipelines.slice(0, 3)" :key="pipeline.id">
              <td>{{ pipeline.name }}</td>
              <td>{{ pipeline.owner }}</td>
              <td>{{ pipeline.lastRun }}</td>
              <td>{{ pipeline.nextRun }}</td>
              <td><StatusBadge :status="pipeline.status" /></td>
              <td><RouterLink class="btn btn-sm btn-outline-secondary" :to="`/pipelines/${pipeline.id}`">Open</RouterLink></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="row g-3">
      <article class="col-12 col-xl-4">
        <section class="card h-100">
          <header class="card-header bg-white d-flex justify-content-between align-items-center">
            <h2 class="h6 mb-0">Connections</h2>
            <button class="btn btn-sm btn-outline-primary" type="button" @click="addConnection">Добавить</button>
          </header>
          <ul class="list-group list-group-flush">
            <li v-for="connection in connections" :key="connection.id" class="list-group-item d-flex justify-content-between align-items-center">
              {{ connection.name }}
              <button class="btn btn-sm btn-outline-danger" type="button" @click="removeConnection(connection.id)">Удалить</button>
            </li>
          </ul>
        </section>
      </article>

      <article class="col-12 col-xl-4">
        <section class="card h-100">
          <header class="card-header bg-white d-flex justify-content-between align-items-center">
            <h2 class="h6 mb-0">Variables</h2>
            <button class="btn btn-sm btn-outline-primary" type="button" @click="addVariable">Добавить</button>
          </header>
          <ul class="list-group list-group-flush">
            <li v-for="variable in variables" :key="variable.id" class="list-group-item">
              <strong>{{ variable.key }}</strong>: {{ variable.value }}
            </li>
          </ul>
        </section>
      </article>

      <article class="col-12 col-xl-4">
        <section class="card h-100">
          <header class="card-header bg-white"><h2 class="h6 mb-0">Recent notifications</h2></header>
          <ul class="list-group list-group-flush">
            <li v-for="item in notifications" :key="item.id" class="list-group-item">
              <StatusBadge :status="item.severity" /> {{ item.text }}
            </li>
          </ul>
        </section>
      </article>
    </section>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import IconSprite from '../components/IconSprite.vue';
import StatCard from '../components/StatCard.vue';
import StatusBadge from '../components/StatusBadge.vue';
import { useAuth } from '../composables/useAuth';
import { useToast } from '../composables/useToast';
import { dataApi } from '../services/api';

const { user } = useAuth();
const { showToast } = useToast();

const pipelines = ref([]);
const notifications = ref([]);
const connections = ref([]);
const variables = ref([]);

const firstName = computed(() => user.value?.name?.split(' ')[0] || 'User');
const unreadNotifications = computed(() => notifications.value.filter((item) => !item.read));
const stats = [
  { label: "Всего DAG'ов", value: 42 },
  { label: 'Активных пайплайнов', value: 31 },
  { label: 'Ошибок за сутки', value: 5 },
  { label: 'Успешных запусков', value: 287 },
  { label: 'SLA violations', value: 2 }
];

const loadData = async () => {
  const [pipelinesRes, notificationsRes, connectionsRes, variablesRes] = await Promise.all([
    dataApi.getPipelines(),
    dataApi.getNotifications(),
    dataApi.getConnections(),
    dataApi.getVariables()
  ]);

  pipelines.value = pipelinesRes.data;
  notifications.value = notificationsRes.data;
  connections.value = connectionsRes.data;
  variables.value = variablesRes.data;
};

const addConnection = async () => {
  const name = window.prompt('Название соединения');
  if (!name) return;
  await dataApi.createConnection({ name });
  await loadData();
  showToast('Соединение добавлено.');
};

const removeConnection = async (id) => {
  if (!window.confirm('Удалить соединение?')) return;
  await dataApi.deleteConnection(id);
  await loadData();
  showToast('Соединение удалено.');
};

const addVariable = async () => {
  const key = window.prompt('Ключ переменной');
  const value = key ? window.prompt('Значение переменной') : '';
  if (!key || !value) return;
  await dataApi.createVariable({ key, value });
  await loadData();
  showToast('Переменная добавлена.');
};

const markNotificationsRead = () => {
  notifications.value = notifications.value.map((item) => ({ ...item, read: true }));
  showToast('Уведомления помечены как прочитанные.');
};

onMounted(loadData);
</script>
