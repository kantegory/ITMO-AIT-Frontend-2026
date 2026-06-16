<script setup lang="ts">
import { computed, onMounted } from 'vue';
import AppShell from '../components/AppShell.vue';
import StatCard from '../components/StatCard.vue';
import TaskRow from '../components/TaskRow.vue';
import ProjectItem from '../components/ProjectItem.vue';
import ActivityItem from '../components/ActivityItem.vue';
import { useAuth } from '../composables/useAuth';
import { useAsync } from '../composables/useAsync';
import { getTasks } from '../api/tasks';
import { getProjects } from '../api/projects';
import { getActivity } from '../api/activity';
import type { Activity, Project, Task } from '../types/domain';
import { isOverdue } from '../utils/render';

const { user } = useAuth();

interface DashboardData {
  tasks: Task[];
  projects: Project[];
  activity: Activity[];
}

const { data, error, loading, run } = useAsync<DashboardData>(async () => {
  const uid = user.value!.id;
  const [tasks, projects, activity] = await Promise.all([
    getTasks({ assigneeId: uid }),
    getProjects(),
    getActivity({ _sort: 'createdAt', _order: 'desc', _limit: 4 }),
  ]);
  return { tasks, projects, activity };
}, 'Не удалось загрузить данные');

onMounted(() => {
  document.title = 'Кабинет — ТаскерAI';
  void run();
});

const tasks = computed<Task[]>(() => data.value?.tasks ?? []);
const projects = computed<Project[]>(() => data.value?.projects ?? []);
const activity = computed<Activity[]>(() => data.value?.activity ?? []);

const projectsById = computed(() => new Map(projects.value.map((p) => [p.id, p])));
const tasksById = computed(() => new Map(tasks.value.map((t) => [t.id, t])));

const overdueCount = computed(() => tasks.value.filter((t) => isOverdue(t.deadline, t.status)).length);
const activeCount = computed(() => tasks.value.filter((t) => t.status !== 'done').length);
const inProgress = computed(() => tasks.value.filter((t) => t.status === 'progress').length);
const doneCount = computed(() => tasks.value.filter((t) => t.status === 'done').length);

const greetingSub = computed(() =>
  overdueCount.value > 0
    ? `У вас ${activeCount.value} активных задач и ${overdueCount.value} просроченных`
    : `У вас ${activeCount.value} активных задач`,
);

function activityTargetName(a: Activity): string {
  if (a.targetType === 'task') return tasksById.value.get(a.targetId)?.title ?? `задача #${a.targetId}`;
  return projectsById.value.get(a.targetId)?.name ?? `проект #${a.targetId}`;
}
</script>

<template>
  <AppShell title="Личный кабинет">
    <main class="page-body" id="main">
      <div class="page-greeting">
        <h1>Добрый день, {{ user?.name }} 👋</h1>
        <p>{{ loading ? 'Загружаем…' : greetingSub }}</p>
      </div>

      <div class="stats-grid">
        <StatCard label="Всего задач" :value="loading ? '—' : tasks.length" sub="У вас в работе" tone="violet" />
        <StatCard label="В работе" :value="loading ? '—' : inProgress" sub="Активные сейчас" tone="yellow" />
        <StatCard label="Выполнено" :value="loading ? '—' : doneCount" sub="Закрытые задачи" tone="green" />
        <StatCard label="Просрочено" :value="loading ? '—' : overdueCount" sub="Требуют внимания" tone="red" />
      </div>

      <div class="bottom-grid">
        <div>
          <div class="section-header">
            <span class="section-title">Мои задачи</span>
            <RouterLink to="/search" class="section-link">Все задачи →</RouterLink>
          </div>
          <div class="task-table">
            <div class="task-row header-row">
              <span>Задача</span>
              <span>Приоритет</span>
              <span>Статус</span>
              <span>Дедлайн</span>
            </div>
            <div aria-live="polite" :aria-busy="loading">
              <div v-if="loading" class="task-row" style="color: var(--text-muted); justify-content: center; display: flex;">Загружаем задачи…</div>
              <div v-else-if="error" class="task-row" style="color:#f87171;">{{ error }}</div>
              <div v-else-if="tasks.length === 0" class="task-row" style="color:var(--text-muted); display:flex; justify-content:center;">Нет задач</div>
              <TaskRow
                v-else
                v-for="t in tasks.slice(0, 6)"
                :key="t.id"
                :task="t"
                :project-name="projectsById.get(t.projectId)?.name ?? ''"
              />
            </div>
          </div>
        </div>

        <div class="right-col">
          <div>
            <div class="section-header">
              <span class="section-title">Прогресс проектов</span>
            </div>
            <div class="task-table" aria-live="polite" style="padding: 18px 18px 10px;">
              <div v-if="loading" style="color: var(--text-muted); font-size: 0.85rem;">Загружаем проекты…</div>
              <div v-else-if="projects.length === 0" style="color: var(--text-muted); font-size: 0.85rem;">Нет проектов</div>
              <ProjectItem v-else v-for="p in projects" :key="p.id" :project="p" />
            </div>
          </div>

          <div>
            <div class="section-header">
              <span class="section-title">Активность</span>
            </div>
            <div class="task-table" style="padding: 8px;">
              <div class="activity-list" aria-live="polite">
                <div v-if="loading" style="padding: 10px 12px; color: var(--text-muted); font-size: 0.8rem;">Загружаем активность…</div>
                <div v-else-if="activity.length === 0" style="padding: 10px 12px; color: var(--text-muted); font-size: 0.8rem;">Нет недавней активности</div>
                <ActivityItem
                  v-else
                  v-for="a in activity"
                  :key="a.id"
                  :activity="a"
                  :target-name="activityTargetName(a)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </AppShell>
</template>

<style>
.page-greeting { margin-bottom: 28px; }
.page-greeting h1 { font-size: 1.4rem; margin-bottom: 4px; }
.page-greeting p { color: var(--text-secondary); font-size: 0.9rem; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
.stat-card { background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 18px 20px; transition: border-color var(--transition); }
.stat-card:hover { border-color: var(--border-accent); }
.stat-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 10px; }
.stat-value { font-size: 1.8rem; font-weight: 700; line-height: 1; margin-bottom: 6px; }
.stat-sub { font-size: 0.75rem; color: var(--text-muted); }
.stat-value.violet { color: var(--violet-400); }
.stat-value.green  { color: #34d399; }
.stat-value.yellow { color: #fbbf24; }
.stat-value.red    { color: #f87171; }

.bottom-grid { display: grid; grid-template-columns: 1fr 320px; gap: 16px; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.section-title { font-size: 0.95rem; font-weight: 600; color: var(--text-primary); }
.section-link { font-size: 0.8rem; color: var(--text-accent); }

.task-table { background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow: hidden; }
.task-row { display: grid; grid-template-columns: minmax(0,1fr) 100px 120px 100px; align-items: center; padding: 13px 18px; border-bottom: 1px solid var(--border-subtle); gap: 12px; transition: background var(--transition); text-decoration: none; color: inherit; }
.task-row:last-child { border-bottom: none; }
.task-row:hover { background: rgba(139,92,246,0.05); }
.task-row.header-row { background: var(--bg-overlay); font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); cursor: default; }
.task-row.header-row:hover { background: var(--bg-overlay); }
.task-name { font-size: 0.875rem; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.task-name .task-project { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }
.task-deadline { font-size: 0.8rem; color: var(--text-muted); }
.task-deadline.overdue { color: #f87171; }

.right-col { display: flex; flex-direction: column; gap: 16px; }
.project-item { margin-bottom: 14px; }
.project-item:last-child { margin-bottom: 0; }
.project-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
.project-name { font-size: 0.82rem; font-weight: 500; color: var(--text-primary); }
.project-pct { font-size: 0.78rem; color: var(--text-muted); }
.progress-track { height: 5px; background: var(--bg-overlay); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 3px; background: var(--gradient-primary); }

.activity-list { display: flex; flex-direction: column; gap: 2px; }
.activity-item { display: flex; gap: 10px; padding: 10px 12px; border-radius: var(--radius-md); transition: background var(--transition); }
.activity-item:hover { background: rgba(139,92,246,0.05); }
.activity-icon { width: 28px; height: 28px; border-radius: 50%; background: var(--bg-overlay); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; flex-shrink: 0; margin-top: 1px; }
.activity-text { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4; }
.activity-text strong { color: var(--text-primary); font-weight: 500; }
.activity-time { font-size: 0.7rem; color: var(--text-muted); margin-top: 2px; }

@media (max-width: 1200px) {
  .task-row { grid-template-columns: minmax(0,1fr) 110px 110px; }
  .task-row > :nth-child(3) { display: none; }
}
@media (max-width: 1100px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .bottom-grid { grid-template-columns: 1fr; }
  .right-col { flex-direction: row; flex-wrap: wrap; }
  .right-col > div { flex: 1 1 280px; min-width: 0; }
}
@media (max-width: 768px) {
  .task-row { grid-template-columns: minmax(0,1fr) 90px; }
  .task-row > :nth-child(2),
  .task-row > :nth-child(3) { display: none; }
}
</style>
