<template>
  <AppLayout title="Pipelines">
    <div class="row g-3">
      <aside class="col-12 col-xl-3" aria-label="Фильтры пайплайнов">
        <section class="card">
          <header class="card-header bg-white"><h2 class="h6 mb-0">Фильтры</h2></header>
          <div class="card-body">
            <form class="d-grid gap-3" @submit.prevent>
              <div>
                <label class="form-label" for="searchName">Поиск по имени</label>
                <input id="searchName" v-model.trim="filters.search" class="form-control" placeholder="daily_sales_etl">
              </div>
              <div>
                <label class="form-label" for="statusFilter">Статус</label>
                <select id="statusFilter" v-model="filters.status" class="form-select">
                  <option value="">Все</option>
                  <option v-for="status in statuses" :key="status">{{ status }}</option>
                </select>
              </div>
              <div>
                <label class="form-label" for="ownerFilter">Владелец</label>
                <select id="ownerFilter" v-model="filters.owner" class="form-select">
                  <option value="">Все</option>
                  <option v-for="owner in owners" :key="owner">{{ owner }}</option>
                </select>
              </div>
              <div>
                <label class="form-label" for="lastRunFilter">Последний запуск</label>
                <input id="lastRunFilter" v-model="filters.lastRun" class="form-control" type="date">
              </div>
              <div class="form-check">
                <input id="onlyActive" v-model="filters.onlyActive" class="form-check-input" type="checkbox">
                <label class="form-check-label" for="onlyActive">Only active</label>
              </div>
              <button class="btn btn-outline-primary" type="button" @click="resetFilters">Сбросить</button>
            </form>
          </div>
        </section>
      </aside>

      <section class="col-12 col-xl-9" aria-labelledby="pipelineListHeading">
        <article class="card">
          <header class="card-header bg-white d-flex justify-content-between align-items-center">
            <h2 id="pipelineListHeading" class="h6 mb-0">Список пайплайнов</h2>
            <button class="btn btn-sm btn-outline-primary" type="button" @click="toggleSort">Сортировать по Last run</button>
          </header>
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>Название DAG</th>
                  <th>Описание</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Last run</th>
                  <th>Next run</th>
                  <th>Open</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pipeline in filteredPipelines" :key="pipeline.id">
                  <td>{{ pipeline.name }}</td>
                  <td>{{ pipeline.description }}</td>
                  <td>{{ pipeline.owner }}</td>
                  <td><StatusBadge :status="pipeline.status" /></td>
                  <td>{{ pipeline.lastRun }}</td>
                  <td>{{ pipeline.nextRun }}</td>
                  <td><RouterLink class="btn btn-sm btn-outline-primary" :to="`/pipelines/${pipeline.id}`">Open</RouterLink></td>
                </tr>
                <tr v-if="!filteredPipelines.length">
                  <td class="text-center py-4" colspan="7">Ничего не найдено по выбранным фильтрам.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import StatusBadge from '../components/StatusBadge.vue';
import { dataApi } from '../services/api';

const pipelines = ref([]);
const sortedAsc = ref(false);
const filters = reactive({
  search: '',
  status: '',
  owner: '',
  lastRun: '',
  onlyActive: false
});

const statuses = ['Success', 'Failed', 'Running', 'Queued', 'Paused'];
const owners = ['Data Team', 'Analytics Team', 'Platform Team', 'Ivan Petrov'];

const filteredPipelines = computed(() => {
  const result = pipelines.value.filter((pipeline) => {
    const byName = pipeline.name.toLowerCase().includes(filters.search.toLowerCase());
    const byStatus = filters.status ? pipeline.status === filters.status : true;
    const byOwner = filters.owner ? pipeline.owner === filters.owner : true;
    const byDate = filters.lastRun ? pipeline.lastRun.startsWith(filters.lastRun) : true;
    const byActive = filters.onlyActive ? pipeline.active : true;
    return byName && byStatus && byOwner && byDate && byActive;
  });

  return [...result].sort((a, b) => {
    const first = new Date(a.lastRun.replace(' ', 'T'));
    const second = new Date(b.lastRun.replace(' ', 'T'));
    return sortedAsc.value ? first - second : second - first;
  });
});

const resetFilters = () => {
  filters.search = '';
  filters.status = '';
  filters.owner = '';
  filters.lastRun = '';
  filters.onlyActive = false;
};

const toggleSort = () => {
  sortedAsc.value = !sortedAsc.value;
};

onMounted(async () => {
  const { data } = await dataApi.getPipelines();
  pipelines.value = data;
});
</script>
