<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from '../composables/useI18n';
import { useUsers } from '../composables/useUsers';
import { useTaskMeta } from '../composables/useTaskMeta';
import { searchTasks } from '../api/tasks';

const { t } = useI18n();
const { statusLabel, priorityLabel } = useTaskMeta();
const { users, load: loadUsers } = useUsers();

const filters = reactive({
  query: '',
  status: '',
  priority: '',
  assigneeId: '',
});

const results = ref([]);
const error = ref('');
const submitted = ref(false);

onMounted(() => {
  loadUsers();
});

async function onSubmit() {
  submitted.value = true;
  error.value = '';
  const params = {};
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  if (filters.assigneeId) params.assigneeId = filters.assigneeId;
  if (filters.query) params.title_like = filters.query.trim();
  try {
    results.value = (await searchTasks(params)) || [];
  } catch (e) {
    results.value = [];
    error.value = t('common_error');
  }
}

function onReset() {
  filters.query = '';
  filters.status = '';
  filters.priority = '';
  filters.assigneeId = '';
  results.value = [];
  submitted.value = false;
}
</script>

<template>
  <section class="container py-4">
    <h1 class="mb-4">{{ t('search_title') }}</h1>

    <div class="card mb-4">
      <div class="card-body">
        <form class="row g-3" @submit.prevent="onSubmit" @reset.prevent="onReset">
          <div class="col-12 col-md-6">
            <label for="search-query" class="form-label">{{ t('search_query') }}</label>
            <input
              id="search-query"
              v-model="filters.query"
              type="text"
              class="form-control"
              :placeholder="t('search_query_ph')"
            />
          </div>
          <div class="col-6 col-md-2">
            <label for="filter-status" class="form-label">{{ t('search_status') }}</label>
            <select id="filter-status" v-model="filters.status" class="form-select">
              <option value="">{{ t('search_any') }}</option>
              <option value="new">{{ t('status_new') }}</option>
              <option value="progress">{{ t('status_progress') }}</option>
              <option value="review">{{ t('status_review') }}</option>
              <option value="done">{{ t('status_done') }}</option>
            </select>
          </div>
          <div class="col-6 col-md-2">
            <label for="filter-priority" class="form-label">{{ t('search_priority') }}</label>
            <select id="filter-priority" v-model="filters.priority" class="form-select">
              <option value="">{{ t('search_any') }}</option>
              <option value="low">{{ t('priority_low') }}</option>
              <option value="medium">{{ t('priority_medium') }}</option>
              <option value="high">{{ t('priority_high') }}</option>
              <option value="critical">{{ t('priority_critical') }}</option>
            </select>
          </div>
          <div class="col-6 col-md-2">
            <label for="filter-assignee" class="form-label">{{ t('search_assignee') }}</label>
            <select id="filter-assignee" v-model="filters.assigneeId" class="form-select">
              <option value="">{{ t('search_any') }}</option>
              <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
            </select>
          </div>
          <div class="col-12 d-flex align-items-end gap-2">
            <button type="submit" class="btn btn-primary">{{ t('search_btn') }}</button>
            <button type="reset" class="btn btn-outline-secondary">{{ t('search_reset') }}</button>
          </div>
        </form>
      </div>
    </div>

    <h2 class="h5 mb-3">{{ t('search_results') }}</h2>
    <div v-if="error" class="text-muted">{{ error }}</div>
    <div v-else-if="submitted && !results.length" class="text-muted">{{ t('search_empty') }}</div>
    <div v-else class="row g-3">
      <div v-for="task in results" :key="task.id" class="col-12">
        <div class="card">
          <div class="card-body d-flex flex-wrap align-items-center gap-2">
            <span class="badge" :class="task.status ? `badge-status-${task.status}` : 'bg-secondary'">
              {{ statusLabel(task.status) }}
            </span>
            <span v-if="task.priority" class="badge" :class="`badge-priority-${task.priority}`">
              {{ priorityLabel(task.priority) }}
            </span>
            <strong>{{ task.title }}</strong>
            <span class="text-muted small">
              Проект #{{ task.projectId || '' }} · {{ task.assigneeName || '' }}
            </span>
            <RouterLink
              v-if="task.projectId"
              :to="{ name: 'project', params: { id: task.projectId } }"
              class="btn btn-sm btn-outline-primary ms-auto"
            >{{ t('search_open') }}</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
