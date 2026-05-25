<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import AppShell from '../components/AppShell.vue';
import SvgIcon from '../components/SvgIcon.vue';
import TaskCard from '../components/TaskCard.vue';
import { useAuth } from '../composables/useAuth';
import { useDebouncedRef } from '../composables/useDebouncedRef';
import { getProjects } from '../api/projects';
import { getTasks } from '../api/tasks';
import { extractErrorMessage } from '../api/client';
import type { Priority, Project, Task, TaskStatus } from '../types/domain';
import type { TaskFilters } from '../types/api';

const { user } = useAuth();

interface UiFilters {
  status: TaskStatus | '';
  priority: Priority | '';
  projectId: string;
  assignee: '' | 'me';
  sort: 'date-desc' | 'date-asc' | 'priority' | 'name';
}

const INITIAL: UiFilters = {
  status: '',
  priority: '',
  projectId: '',
  assignee: '',
  sort: 'date-desc',
};

const filters = reactive<UiFilters>({ ...INITIAL });
const queryInput = ref('');
const query = useDebouncedRef('', 300);

const projects = ref<Project[]>([]);
const tasks = ref<Task[]>([]);
const loading = ref(false);
const error = ref('');

const projectsById = computed(() => new Map(projects.value.map((p) => [p.id, p])));

const SORT_MAP: Record<UiFilters['sort'], { _sort: string; _order: 'asc' | 'desc' }> = {
  'date-desc': { _sort: 'createdAt', _order: 'desc' },
  'date-asc': { _sort: 'createdAt', _order: 'asc' },
  priority: { _sort: 'priority', _order: 'desc' },
  name: { _sort: 'title', _order: 'asc' },
};

async function loadTasks(): Promise<void> {
  if (!user.value) return;
  loading.value = true;
  error.value = '';
  const params: TaskFilters = { ...SORT_MAP[filters.sort] };
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  if (filters.projectId) params.projectId = Number(filters.projectId);
  if (filters.assignee === 'me') params.assigneeId = user.value.id;
  if (query.value) params.q = query.value;

  try {
    tasks.value = await getTasks(params);
  } catch (err) {
    error.value = extractErrorMessage(err, 'Не удалось загрузить задачи');
  } finally {
    loading.value = false;
  }
}

function reset(): void {
  Object.assign(filters, INITIAL);
  queryInput.value = '';
  query.value = '';
}

onMounted(async () => {
  document.title = 'Поиск задач — ТаскерAI';
  try {
    projects.value = await getProjects();
  } catch (err) {
    error.value = extractErrorMessage(err, 'Не удалось загрузить проекты');
  }
  await loadTasks();
});

watch([filters, query], () => {
  void loadTasks();
});
</script>

<template>
  <AppShell title="Поиск задач">
    <main class="page-body" id="main">
      <div class="search-bar">
        <SvgIcon name="search" />
        <label class="visually-hidden" for="searchInput">Поиск задач</label>
        <input
          type="text"
          id="searchInput"
          class="search-input"
          v-model="queryInput"
          placeholder="Поиск по названию, описанию или исполнителю…"
          aria-label="Поиск задач"
          @input="query = queryInput"
        />
      </div>

      <div class="filters-row">
        <select class="filter-select" v-model="filters.status" aria-label="Фильтр по статусу">
          <option value="">Статус: все</option>
          <option value="todo">К выполнению</option>
          <option value="progress">В работе</option>
          <option value="review">На ревью</option>
          <option value="done">Выполнено</option>
        </select>

        <select class="filter-select" v-model="filters.priority" aria-label="Фильтр по приоритету">
          <option value="">Приоритет: все</option>
          <option value="high">Высокий</option>
          <option value="medium">Средний</option>
          <option value="low">Низкий</option>
        </select>

        <select class="filter-select" v-model="filters.projectId" aria-label="Фильтр по проекту">
          <option value="">Проект: все</option>
          <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>

        <select class="filter-select" v-model="filters.assignee" aria-label="Фильтр по исполнителю">
          <option value="">Исполнитель: все</option>
          <option value="me">Только мои</option>
        </select>

        <button type="button" class="filter-reset" @click="reset" aria-label="Сбросить все фильтры">Сбросить</button>
      </div>

      <div class="results-header">
        <span class="results-count">Найдено: <strong>{{ tasks.length }}</strong> задач</span>
        <div class="sort-row">
          Сортировка:
          <select class="filter-select" v-model="filters.sort" aria-label="Сортировка" style="padding: 5px 28px 5px 10px">
            <option value="date-desc">Дата ↓</option>
            <option value="date-asc">Дата ↑</option>
            <option value="priority">Приоритет</option>
            <option value="name">По названию</option>
          </select>
        </div>
      </div>

      <div class="task-grid" aria-live="polite">
        <TaskCard
          v-for="t in tasks"
          :key="t.id"
          :task="t"
          :project-name="projectsById.get(t.projectId)?.name ?? '—'"
        />
      </div>

      <div v-if="loading" role="status" aria-live="polite" style="text-align:center; padding: 40px 0; color: var(--text-muted); font-size: 0.9rem;">Загружаем…</div>
      <div v-else-if="error" role="alert" style="text-align:center; padding: 40px 0; color:#f87171;">{{ error }}</div>
      <div v-else-if="tasks.length === 0" style="text-align: center; padding: 60px 0; color: var(--text-muted);">
        <SvgIcon name="search" :size="40" />
        <p style="font-size: 0.9rem">Ничего не найдено</p>
        <p style="font-size: 0.8rem; margin-top: 6px">Попробуйте изменить фильтры или поисковый запрос</p>
      </div>
    </main>
  </AppShell>
</template>

<style>
.search-bar { position: relative; margin-bottom: 20px; }
.search-bar svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); width: 18px; height: 18px; pointer-events: none; }
.search-input { width: 100%; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); color: var(--text-primary); padding: 13px 16px 13px 48px; font-size: 0.95rem; font-family: var(--font-sans); outline: none; transition: border-color var(--transition), box-shadow var(--transition); }
.search-input::placeholder { color: var(--text-muted); }
.search-input:focus { border-color: var(--violet-500); box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15); }

.filters-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; align-items: center; }
.filter-select { background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: var(--text-secondary); padding: 8px 32px 8px 12px; font-size: 0.82rem; font-family: var(--font-sans); outline: none; cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; transition: border-color var(--transition); }
.filter-select option { background: var(--bg-elevated); color: var(--text-primary); }
.filter-select:focus { border-color: var(--violet-500); }
.filter-reset { margin-left: auto; font-size: 0.8rem; color: var(--text-muted); background: none; border: none; cursor: pointer; transition: color var(--transition); padding: 0; }
.filter-reset:hover { color: var(--text-accent); }

.results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.results-count { font-size: 0.82rem; color: var(--text-muted); }
.results-count strong { color: var(--text-primary); font-weight: 600; }
.sort-row { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-muted); }

.task-grid { display: flex; flex-direction: column; gap: 8px; }
.task-card { display: grid; grid-template-columns: 1fr 130px 120px 130px 36px; align-items: center; gap: 12px; padding: 14px 18px; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); text-decoration: none; color: inherit; transition: all var(--transition); }
.task-card:hover { border-color: var(--border-accent); background: rgba(139, 92, 246, 0.04); }
.task-card-title { font-size: 0.875rem; font-weight: 500; color: var(--text-primary); margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.task-card-meta { display: flex; align-items: center; gap: 10px; font-size: 0.75rem; color: var(--text-muted); }
.meta-project { display: flex; align-items: center; gap: 4px; }
.meta-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--violet-500); flex-shrink: 0; }
.task-menu-btn { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); background: none; border: none; color: var(--text-muted); cursor: pointer; opacity: 0; transition: all var(--transition); }
.task-card:hover .task-menu-btn { opacity: 1; }
.task-menu-btn:hover { background: var(--bg-overlay); color: var(--text-primary); }

@media (max-width: 900px) {
  .task-card { grid-template-columns: 1fr 120px; }
  .task-card > :nth-child(3),
  .task-card > :nth-child(4),
  .task-card > :nth-child(5) { display: none; }
}
</style>
