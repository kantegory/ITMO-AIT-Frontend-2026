<template>
  <AppLayout title="Monitoring">
    <section class="row g-3 mb-4" aria-label="Состояние планировщика">
      <div v-for="stat in schedulerStats" :key="stat.label" class="col-12 col-md-6 col-xl-3">
        <StatCard :label="stat.label" :value="stat.value" />
      </div>
    </section>

    <section class="row g-3" aria-label="Мониторинг и уведомления">
      <article class="col-12 col-xl-5">
        <section class="card h-100">
          <header class="card-header bg-white d-flex justify-content-between align-items-center">
            <h2 class="h6 mb-0">Notifications</h2>
            <div class="d-flex gap-2">
              <select v-model="severityFilter" class="form-select form-select-sm" aria-label="Фильтр уведомлений">
                <option value="all">All</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
              <button class="btn btn-sm btn-outline-primary" type="button" @click="markRead">Mark as read</button>
            </div>
          </header>
          <ul class="list-group list-group-flush">
            <li v-for="item in filteredNotifications" :key="item.id" class="list-group-item" :class="{ read: read }">
              <StatusBadge :status="item.severity" /> {{ item.text }}
            </li>
          </ul>
        </section>
      </article>

      <article class="col-12 col-xl-7">
        <section class="card h-100">
          <header class="card-header bg-white"><h2 class="h6 mb-0">SLA monitoring</h2></header>
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>Pipeline</th>
                  <th>SLA deadline</th>
                  <th>Current state</th>
                  <th>Delay</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in slaRows" :key="row.pipeline">
                  <td>{{ row.pipeline }}</td>
                  <td>{{ row.deadline }}</td>
                  <td>{{ row.state }}</td>
                  <td>{{ row.delay }}</td>
                  <td><StatusBadge :status="row.severity" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>

      <article class="col-12 col-xl-6">
        <section class="card h-100">
          <header class="card-header bg-white"><h2 class="h6 mb-0">Resource usage</h2></header>
          <div class="card-body">
            <template v-for="resource in resources" :key="resource.label">
              <p class="form-label mb-1">{{ resource.label }}</p>
              <div class="progress mb-3">
                <div class="progress-bar" :class="resource.className" :style="{ width: `${resource.value}%` }" role="progressbar" :aria-valuenow="resource.value" aria-valuemin="0" aria-valuemax="100">
                  {{ resource.value }}%
                </div>
              </div>
            </template>
          </div>
        </section>
      </article>

      <article class="col-12 col-xl-6">
        <section class="card h-100">
          <header class="card-header bg-white"><h2 class="h6 mb-0">Upcoming scheduled runs</h2></header>
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>Pipeline</th>
                  <th>Owner</th>
                  <th>Next run</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="run in upcoming" :key="run.pipeline">
                  <td>{{ run.pipeline }}</td>
                  <td>{{ run.owner }}</td>
                  <td>{{ run.nextRun }}</td>
                  <td><StatusBadge :status="run.status" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </section>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import StatCard from '../components/StatCard.vue';
import StatusBadge from '../components/StatusBadge.vue';
import { useToast } from '../composables/useToast';
import { dataApi } from '../services/api';

const { showToast } = useToast();
const notifications = ref([]);
const severityFilter = ref('all');
const read = ref(false);

const schedulerStats = [
  { label: 'Active schedulers', value: 3 },
  { label: 'Queued tasks', value: 18 },
  { label: 'Running tasks', value: 27 },
  { label: 'Paused DAGs', value: 4 }
];

const slaRows = [
  { pipeline: 'daily_sales_etl', deadline: '08:10', state: 'Failed', delay: '+12m', severity: 'critical' },
  { pipeline: 'customer_sync', deadline: '07:40', state: 'Running', delay: '+4m', severity: 'warning' },
  { pipeline: 'inventory_update', deadline: '09:20', state: 'On time', delay: '0m', severity: 'info' }
];

const resources = ref([
  { label: 'CPU usage', value: 62, className: '' },
  { label: 'Memory usage', value: 71, className: 'bg-danger' },
  { label: 'Worker load', value: 78, className: 'bg-warning' },
  { label: 'Queue load', value: 49, className: 'bg-success' }
]);

const upcoming = [
  { pipeline: 'marketing_report_build', owner: 'Analytics Team', nextRun: '2026-03-14 10:30', status: 'Queued' },
  { pipeline: 'fraud_detection_batch', owner: 'Platform Team', nextRun: '2026-03-14 11:00', status: 'Running' },
  { pipeline: 'customer_sync', owner: 'Ivan Petrov', nextRun: '2026-03-14 13:30', status: 'Paused' }
];

const filteredNotifications = computed(() => {
  if (severityFilter.value === 'all') return notifications.value;
  return notifications.value.filter((item) => item.severity === severityFilter.value);
});

const markRead = () => {
  read.value = true;
  showToast('Уведомления помечены как прочитанные.');
};

onMounted(async () => {
  const { data } = await dataApi.getNotifications();
  notifications.value = data;

  setInterval(() => {
    resources.value = resources.value.map((item) => ({
      ...item,
      value: Math.floor(Math.random() * 71) + 20
    }));
  }, 3500);
});
</script>
