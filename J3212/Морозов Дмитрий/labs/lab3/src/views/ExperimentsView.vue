<script setup>
import { computed, onMounted, reactive, watch } from 'vue';
import { RouterLink } from 'vue-router';
import NotificationAlert from '../components/NotificationAlert.vue';
import PaginationControls from '../components/PaginationControls.vue';
import { useExperiments } from '../composables/useExperiments';
import { useNotifications } from '../composables/useNotifications';
import { usePagination } from '../composables/usePagination';

const { experiments, isLoading, loadExperiments } = useExperiments();
const { notification, showNotification } = useNotifications();
const filters = reactive({
  search: '',
  dateFrom: '',
  dateTo: '',
  status: '',
  metricMin: '',
  metricMax: '',
  tags: '',
});

const filteredExperiments = computed(() => {
  const tags = filters.tags
    .toLowerCase()
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  return experiments.value.filter((experiment) => {
    const metric = Number(experiment.metric);
    const matchesName = !filters.search || experiment.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesDateFrom = !filters.dateFrom || experiment.date >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || experiment.date <= filters.dateTo;
    const matchesStatus = !filters.status || experiment.status === filters.status;
    const matchesMetricMin = !filters.metricMin || metric >= Number(filters.metricMin);
    const matchesMetricMax = !filters.metricMax || metric <= Number(filters.metricMax);
    const matchesTags = !tags.length || tags.some((tag) => experiment.tags?.some((item) => item.toLowerCase().includes(tag)));

    return matchesName && matchesDateFrom && matchesDateTo && matchesStatus && matchesMetricMin && matchesMetricMax && matchesTags;
  });
});

const { currentPage, totalPages, pageItems, goToPage, resetPage } = usePagination(filteredExperiments, 8);

function resetFilters() {
  Object.assign(filters, {
    search: '',
    dateFrom: '',
    dateTo: '',
    status: '',
    metricMin: '',
    metricMax: '',
    tags: '',
  });
}

watch(filteredExperiments, resetPage);

onMounted(async () => {
  try {
    await loadExperiments();
  } catch {
    showNotification('Не удалось загрузить эксперименты', 'danger');
  }
});
</script>

<template>
  <section>
    <h1>Эксперименты</h1>
    <p class="text-muted">Поиск и фильтрация ML-запусков</p>
    <NotificationAlert :notification="notification" />

    <div class="card mb-4">
      <div class="card-body">
        <form class="row g-3" @submit.prevent>
          <div class="col-md-4">
            <label for="search-name" class="form-label">Название</label>
            <input id="search-name" v-model.trim="filters.search" class="form-control" placeholder="model_v1" />
          </div>
          <div class="col-md-2">
            <label for="date-from" class="form-label">Дата от</label>
            <input id="date-from" v-model="filters.dateFrom" class="form-control" type="date" />
          </div>
          <div class="col-md-2">
            <label for="date-to" class="form-label">Дата до</label>
            <input id="date-to" v-model="filters.dateTo" class="form-control" type="date" />
          </div>
          <div class="col-md-2">
            <label for="filter-status" class="form-label">Статус</label>
            <select id="filter-status" v-model="filters.status" class="form-select">
              <option value="">Все</option>
              <option>Completed</option>
              <option>Running</option>
              <option>Failed</option>
              <option>Pending</option>
            </select>
          </div>
          <div class="col-md-1">
            <label for="metric-min" class="form-label">Min</label>
            <input id="metric-min" v-model="filters.metricMin" class="form-control" type="number" min="0" max="1" step="0.01" />
          </div>
          <div class="col-md-1">
            <label for="metric-max" class="form-label">Max</label>
            <input id="metric-max" v-model="filters.metricMax" class="form-control" type="number" min="0" max="1" step="0.01" />
          </div>
          <div class="col-md-10">
            <label for="filter-tags" class="form-label">Теги</label>
            <input id="filter-tags" v-model.trim="filters.tags" class="form-control" placeholder="production, baseline" />
          </div>
          <div class="col-md-2 d-flex align-items-end">
            <button class="btn btn-outline-secondary w-100" type="button" @click="resetFilters">Сбросить</button>
          </div>
        </form>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <span class="text-muted">Найдено: {{ filteredExperiments.length }}</span>
      <span v-if="isLoading" class="text-muted">Загрузка...</span>
    </div>

    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Название</th>
            <th>Дата</th>
            <th>Метрика</th>
            <th>Теги</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="experiment in pageItems" :key="experiment.id">
            <td><RouterLink :to="`/experiments/${experiment.id}`">{{ experiment.name }}</RouterLink></td>
            <td>{{ experiment.date }}</td>
            <td>{{ experiment.metric ? experiment.metric.toFixed(2) : '—' }}</td>
            <td>{{ experiment.tags?.join(', ') || '—' }}</td>
            <td>{{ experiment.status }}</td>
            <td><RouterLink class="btn btn-sm btn-primary" :to="`/experiments/${experiment.id}`">Просмотр</RouterLink></td>
          </tr>
          <tr v-if="!pageItems.length">
            <td colspan="6" class="text-center text-muted">Эксперименты не найдены</td>
          </tr>
        </tbody>
      </table>
    </div>

    <PaginationControls :current-page="currentPage" :total-pages="totalPages" @change="goToPage" />
  </section>
</template>
