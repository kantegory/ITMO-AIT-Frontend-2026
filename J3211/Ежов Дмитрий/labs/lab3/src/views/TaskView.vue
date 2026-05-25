<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import AppShell from '../components/AppShell.vue';
import SvgIcon from '../components/SvgIcon.vue';
import SubtaskItem from '../components/SubtaskItem.vue';
import { useAuth } from '../composables/useAuth';
import { getTask, updateTask } from '../api/tasks';
import { getProjects } from '../api/projects';
import { extractErrorMessage } from '../api/client';
import type { Priority, Project, Task, TaskStatus } from '../types/domain';
import { formatDate, formatFileSize, priorityEmoji, priorityLabel, statusLabel } from '../utils/render';

const props = defineProps<{ id: string }>();
const taskId = computed(() => Number(props.id));

const { user } = useAuth();

const task = ref<Task | null>(null);
const projects = ref<Project[]>([]);
const error = ref('');
const saveError = ref('');
const loading = ref(true);

const projectName = computed(() => {
  if (!task.value) return '—';
  return projects.value.find((p) => p.id === task.value!.projectId)?.name ?? '—';
});

const isDone = computed(() => task.value?.status === 'done');
const subtasksDone = computed(() => task.value?.subtasks.filter((s) => s.done).length ?? 0);
const subtasksTitle = computed(() => {
  if (!task.value || task.value.subtasks.length === 0) return 'Подзадачи';
  return `Подзадачи — ${subtasksDone.value} из ${task.value.subtasks.length} выполнено`;
});

const descriptionParagraphs = computed(() => (task.value?.description ?? '').split(/\n\n+/));

const assigneeInitial = computed(() => {
  if (!task.value || !user.value) return '?';
  return user.value.id === task.value.assigneeId ? user.value.name.charAt(0).toUpperCase() : '?';
});
const assigneeDisplayName = computed(() => {
  if (!task.value || !user.value) return '—';
  return user.value.id === task.value.assigneeId
    ? user.value.name
    : `Пользователь #${task.value.assigneeId}`;
});

async function load(): Promise<void> {
  loading.value = true;
  error.value = '';
  try {
    const [t, ps] = await Promise.all([getTask(taskId.value), getProjects()]);
    task.value = t;
    projects.value = ps;
  } catch (err) {
    error.value = extractErrorMessage(err, 'Не удалось загрузить задачу');
  } finally {
    loading.value = false;
  }
}

async function persist(patch: Partial<Task>): Promise<void> {
  if (!task.value) return;
  const backup = task.value;
  task.value = { ...task.value, ...patch } as Task;
  saveError.value = '';
  try {
    const updated = await updateTask(taskId.value, patch);
    task.value = updated;
  } catch (err) {
    task.value = backup;
    saveError.value = extractErrorMessage(err, 'Не удалось сохранить изменения');
  }
}

function onStatusChange(e: Event): void {
  void persist({ status: (e.target as HTMLSelectElement).value as TaskStatus });
}
function onPriorityChange(e: Event): void {
  void persist({ priority: (e.target as HTMLSelectElement).value as Priority });
}
function onDeadlineChange(e: Event): void {
  void persist({ deadline: (e.target as HTMLInputElement).value });
}
function toggleDone(): void {
  if (!task.value) return;
  const next: TaskStatus = task.value.status === 'done' ? 'progress' : 'done';
  void persist({ status: next });
}
function toggleSubtask(id: number): void {
  if (!task.value) return;
  const subtasks = task.value.subtasks.map((s) => (s.id === id ? { ...s, done: !s.done } : s));
  void persist({ subtasks });
}

onMounted(() => {
  document.title = 'Задача — ТаскерAI';
  void load();
});

watch(taskId, () => {
  void load();
});
</script>

<template>
  <AppShell>
    <template #topbar-left>
      <nav class="breadcrumb-nav" aria-label="Хлебные крошки">
        <RouterLink to="/search">Поиск задач</RouterLink>
        <SvgIcon name="chevron-right" :size="14" />
        <span style="color: var(--text-secondary)">{{ task?.title ?? '—' }}</span>
      </nav>
    </template>

    <div v-if="!error" class="task-layout">
      <main class="task-main" id="main">
        <div class="task-title-row">
          <div
            class="task-done-check"
            :class="{ checked: isDone }"
            role="checkbox"
            tabindex="0"
            :aria-checked="isDone"
            aria-label="Отметить задачу выполненной"
            @click="toggleDone"
            @keydown.enter.prevent="toggleDone"
            @keydown.space.prevent="toggleDone"
          >
            <svg v-if="isDone" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="2 6 5 9 10 3" />
            </svg>
          </div>
          <h1 class="task-title">{{ loading ? 'Загружаем…' : task?.title }}</h1>
        </div>

        <div v-if="task" class="task-badges" aria-live="polite">
          <span :class="`badge status-${task.status}`">{{ statusLabel(task.status) }}</span>
          <span :class="`badge priority-${task.priority}`">{{ priorityEmoji(task.priority) }} {{ priorityLabel(task.priority) }} приоритет</span>
          <span v-for="tag in task.tags" :key="tag" class="badge tag">#{{ tag }}</span>
        </div>

        <div class="section-block">
          <div class="section-block-title">Описание</div>
          <div class="task-description" aria-live="polite">
            <p v-for="(p, i) in descriptionParagraphs" :key="i">{{ p }}</p>
          </div>
        </div>

        <div class="section-block">
          <div class="section-block-title">{{ subtasksTitle }}</div>
          <div class="subtask-list" role="list" aria-live="polite">
            <div v-if="!task || task.subtasks.length === 0" style="color:var(--text-muted); font-size: 0.85rem; padding: 8px 0;">Подзадач нет</div>
            <SubtaskItem
              v-else
              v-for="s in task.subtasks"
              :key="s.id"
              :subtask="s"
              @toggle="toggleSubtask"
            />
          </div>
        </div>

        <div class="section-block">
          <div class="section-block-title">Вложения</div>
          <div class="attachments-grid" role="list" aria-live="polite">
            <div v-if="!task || task.attachments.length === 0" style="color: var(--text-muted); font-size: 0.85rem;">Вложений нет</div>
            <a v-else v-for="a in task.attachments" :key="a.name" href="#" class="attachment" @click.prevent>
              <div class="attachment-preview">{{ a.icon }}</div>
              <div class="attachment-info">
                <div class="attachment-name">{{ a.name }}</div>
                <div class="attachment-size">{{ formatFileSize(a.size) }}</div>
              </div>
            </a>
          </div>
        </div>
      </main>

      <aside class="task-sidebar" aria-label="Параметры задачи">
        <div
          v-if="saveError"
          role="alert"
          aria-live="assertive"
          style="margin-bottom: 16px; padding: 10px 12px; border-radius: var(--radius-md); background: rgba(248,113,113,0.12); color:#f87171; font-size: 0.78rem;"
        >{{ saveError }}</div>
        <div class="meta-section">
          <div class="meta-label">Статус</div>
          <select class="meta-select" :value="task?.status ?? 'todo'" @change="onStatusChange" aria-label="Статус задачи">
            <option value="todo">К выполнению</option>
            <option value="progress">В работе</option>
            <option value="review">На ревью</option>
            <option value="done">Выполнено</option>
          </select>
        </div>

        <div class="meta-section">
          <div class="meta-label">Приоритет</div>
          <select class="meta-select" :value="task?.priority ?? 'medium'" @change="onPriorityChange" aria-label="Приоритет задачи">
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>

        <div class="meta-section">
          <div class="meta-label">Исполнитель</div>
          <div class="assignee-row">
            <div class="assignee-ava">{{ assigneeInitial }}</div>
            <span>{{ assigneeDisplayName }}</span>
          </div>
        </div>

        <div class="meta-section">
          <div class="meta-label">Проект</div>
          <div class="meta-value">
            <SvgIcon name="box" :size="14" />
            <span>{{ projectName }}</span>
          </div>
        </div>

        <div class="meta-section">
          <div class="meta-label">Дедлайн</div>
          <input
            type="date"
            class="meta-date-input"
            :value="task?.deadline ?? ''"
            @change="onDeadlineChange"
            aria-label="Дедлайн задачи"
          />
        </div>

        <div class="meta-section">
          <div class="meta-label">Создана</div>
          <div class="meta-value" style="font-size: 0.82rem; color: var(--text-muted)">{{ task ? formatDate(task.createdAt) : '—' }}</div>
        </div>
      </aside>
    </div>

    <div v-else role="alert" aria-live="assertive" style="padding: 30px; color:#f87171; text-align:center;">{{ error }}</div>
  </AppShell>
</template>

<style>
.breadcrumb-nav { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; color: var(--text-muted); }
.breadcrumb-nav a { color: var(--text-muted); text-decoration: none; transition: color var(--transition); }
.breadcrumb-nav a:hover { color: var(--text-accent); }
.breadcrumb-nav svg { opacity: 0.4; flex-shrink: 0; }

.task-layout { display: grid; grid-template-columns: 1fr 280px; gap: 0; flex: 1; min-height: 0; }
.task-main { padding: 32px 36px; border-right: 1px solid var(--border-subtle); overflow-y: auto; }
.task-title-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 20px; }
.task-done-check { width: 22px; height: 22px; min-width: 22px; border: 1.5px solid var(--border-accent); border-radius: 6px; margin-top: 3px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all var(--transition); background: var(--bg-overlay); }
.task-done-check:hover { border-color: var(--violet-500); background: rgba(139, 92, 246, 0.1); }
.task-done-check.checked { background: var(--violet-500); border-color: var(--violet-500); }
.task-title { font-size: 1.35rem; font-weight: 700; line-height: 1.3; color: var(--text-primary); flex: 1; }

.task-badges { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.badge { display: inline-flex; align-items: center; gap: 5px; font-size: 0.72rem; font-weight: 600; padding: 4px 10px; border-radius: var(--radius-full); white-space: nowrap; }
.badge.status-progress { background: rgba(139, 92, 246, 0.12); color: #a78bfa; }
.badge.status-todo { background: rgba(148, 163, 184, 0.12); color: #94a3b8; }
.badge.status-review { background: rgba(251, 191, 36, 0.12); color: #fbbf24; }
.badge.status-done { background: rgba(52, 211, 153, 0.12); color: #34d399; }
.badge.priority-high { background: rgba(248, 113, 113, 0.12); color: #f87171; }
.badge.priority-medium { background: rgba(251, 191, 36, 0.12); color: #fbbf24; }
.badge.priority-low { background: rgba(52, 211, 153, 0.12); color: #34d399; }
.badge.tag { background: var(--bg-overlay); color: var(--text-secondary); border: 1px solid var(--border-subtle); }

.section-block { margin-bottom: 32px; }
.section-block-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 12px; }
.task-description { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.75; }
.task-description p { margin-bottom: 12px; }
.task-description p:last-child { margin-bottom: 0; }

.subtask-list { display: flex; flex-direction: column; gap: 6px; }
.subtask-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); font-size: 0.85rem; color: var(--text-secondary); transition: border-color var(--transition); }
.subtask-item:hover { border-color: var(--border-accent); }
.subtask-check { width: 16px; height: 16px; min-width: 16px; border: 1.5px solid var(--border-accent); border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all var(--transition); background: var(--bg-overlay); flex-shrink: 0; }
.subtask-check.done { background: #10b981; border-color: #10b981; }
.subtask-item.done-item .subtask-text { text-decoration: line-through; color: var(--text-muted); }
.subtask-text { flex: 1; }
.subtask-assignee { font-size: 0.72rem; color: var(--text-muted); white-space: nowrap; }

.attachments-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
.attachment { background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden; cursor: pointer; transition: all var(--transition); text-decoration: none; }
.attachment:hover { border-color: var(--border-accent); }
.attachment-preview { height: 80px; display: flex; align-items: center; justify-content: center; background: var(--bg-overlay); font-size: 1.8rem; }
.attachment-info { padding: 8px 10px; }
.attachment-name { font-size: 0.75rem; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.attachment-size { font-size: 0.68rem; color: var(--text-muted); margin-top: 1px; }

.task-sidebar { padding: 28px 24px; overflow-y: auto; background: var(--bg-surface); }
.meta-section { margin-bottom: 24px; }
.meta-label { font-size: 0.68rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 8px; }
.meta-value { font-size: 0.875rem; color: var(--text-primary); display: flex; align-items: center; gap: 8px; }
.meta-value svg { color: var(--text-muted); flex-shrink: 0; }
.meta-select { width: 100%; background: var(--bg-overlay); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: var(--text-primary); padding: 8px 12px; font-size: 0.82rem; font-family: var(--font-sans); outline: none; cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; transition: border-color var(--transition); }
.meta-select:focus { border-color: var(--violet-500); }
.meta-select option { background: var(--bg-elevated); }
.assignee-row { display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: var(--bg-overlay); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); font-size: 0.82rem; color: var(--text-primary); }
.assignee-ava { width: 24px; height: 24px; border-radius: 50%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; font-size: 0.68rem; font-weight: 700; color: white; flex-shrink: 0; }
.meta-date-input { width: 100%; background: var(--bg-overlay); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: var(--text-primary); padding: 8px 12px; font-size: 0.82rem; font-family: var(--font-sans); outline: none; transition: border-color var(--transition); }
.meta-date-input:focus { border-color: var(--violet-500); }

@media (max-width: 1000px) {
  .task-layout { grid-template-columns: 1fr; }
  .task-sidebar { border-top: 1px solid var(--border-subtle); }
}
@media (max-width: 768px) {
  .task-main { padding: 20px; }
}
</style>
