import { logout } from '../api/auth';
import { extractErrorMessage } from '../api/client';
import { getProjects } from '../api/projects';
import { getTask, updateTask } from '../api/tasks';
import type { Attachment, Priority, Subtask, Task, TaskStatus, User } from '../types/domain';
import { requireAuth } from '../utils/guard';
import { escapeHtml, formatDate, mustGet } from '../utils/render';

const user = requireAuth();

renderUserCard(user);
attachLogout();

const taskLayout = mustGet<HTMLDivElement>('#taskLayout');
const taskError = mustGet<HTMLDivElement>('#taskError');
const taskTitle = mustGet<HTMLHeadingElement>('#taskTitle');
const taskBadges = mustGet<HTMLDivElement>('#taskBadges');
const taskDescription = mustGet<HTMLDivElement>('#taskDescription');
const subtasksTitle = mustGet<HTMLDivElement>('#subtasksTitle');
const subtaskList = mustGet<HTMLDivElement>('#subtaskList');
const attachmentList = mustGet<HTMLDivElement>('#attachmentList');
const statusSelect = mustGet<HTMLSelectElement>('#statusSelect');
const prioritySelect = mustGet<HTMLSelectElement>('#prioritySelect');
const assigneeAvatar = mustGet<HTMLDivElement>('#assigneeAvatar');
const assigneeName = mustGet<HTMLSpanElement>('#assigneeName');
const projectName = mustGet<HTMLSpanElement>('#projectName');
const deadlineInput = mustGet<HTMLInputElement>('#deadlineInput');
const createdAtEl = mustGet<HTMLDivElement>('#createdAt');
const doneCheck = mustGet<HTMLDivElement>('#doneCheck');
const checkIcon = mustGet<SVGElement>('#checkIcon');

const taskId = readTaskId();
let currentTask: Task | null = null;

void init();

function readTaskId(): number {
  const id = Number(new URLSearchParams(location.search).get('id'));
  if (!id || Number.isNaN(id)) {
    showError('В URL не указан id задачи. Откройте задачу со страницы поиска или дашборда.');
    throw new Error('Missing task id');
  }
  return id;
}

async function init(): Promise<void> {
  try {
    const [task, projects] = await Promise.all([getTask(taskId), getProjects()]);
    currentTask = task;
    const project = projects.find((p) => p.id === task.projectId);
    renderTask(task, project?.name ?? '—');
    attachListeners();
  } catch (err) {
    showError(extractErrorMessage(err, 'Не удалось загрузить задачу'));
  }
}

function renderTask(t: Task, projectNameValue: string): void {
  taskTitle.textContent = t.title;

  taskBadges.innerHTML = [
    `<span class="badge status-${t.status}">${statusLabelLong(t.status)}</span>`,
    `<span class="badge priority-${t.priority}">${priorityEmoji(t.priority)} ${priorityLabelLong(t.priority)} приоритет</span>`,
    ...t.tags.map((tag) => `<span class="badge tag">#${escapeHtml(tag)}</span>`),
  ].join('');

  taskDescription.innerHTML = t.description
    .split(/\n\n+/)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join('');

  renderSubtasks(t.subtasks);
  renderAttachments(t.attachments);

  statusSelect.value = t.status;
  prioritySelect.value = t.priority;
  assigneeAvatar.textContent = user.id === t.assigneeId ? user.name.charAt(0).toUpperCase() : '?';
  assigneeName.textContent = user.id === t.assigneeId ? user.name : `Пользователь #${t.assigneeId}`;
  projectName.textContent = projectNameValue;
  deadlineInput.value = t.deadline;
  createdAtEl.textContent = formatDate(t.createdAt);

  syncDoneCheck(t.status === 'done');
}

function renderSubtasks(subtasks: Subtask[]): void {
  const done = subtasks.filter((s) => s.done).length;
  subtasksTitle.textContent =
    subtasks.length > 0 ? `Подзадачи — ${done} из ${subtasks.length} выполнено` : 'Подзадачи';

  if (subtasks.length === 0) {
    subtaskList.innerHTML = `<div style="color:var(--text-muted); font-size:0.85rem; padding: 8px 0;">Подзадач нет</div>`;
    return;
  }

  subtaskList.innerHTML = subtasks
    .map(
      (s) => `
    <div class="subtask-item ${s.done ? 'done-item' : ''}" data-subtask-id="${s.id}">
      <div class="subtask-check ${s.done ? 'done' : ''}" data-action="toggle-subtask">
        ${s.done ? checkSvg() : ''}
      </div>
      <span class="subtask-text">${escapeHtml(s.text)}</span>
      <span class="subtask-assignee">${user.id === s.assigneeId ? escapeHtml(user.name) : `#${s.assigneeId}`}</span>
    </div>`,
    )
    .join('');
}

function renderAttachments(attachments: Attachment[]): void {
  if (attachments.length === 0) {
    attachmentList.innerHTML = `<div style="color:var(--text-muted); font-size:0.85rem;">Вложений нет</div>`;
    return;
  }
  attachmentList.innerHTML = attachments
    .map(
      (a) => `
    <a href="#" class="attachment">
      <div class="attachment-preview">${escapeHtml(a.icon)}</div>
      <div class="attachment-info">
        <div class="attachment-name">${escapeHtml(a.name)}</div>
        <div class="attachment-size">${formatSize(a.size)}</div>
      </div>
    </a>`,
    )
    .join('');
}

function attachListeners(): void {
  statusSelect.addEventListener('change', () => {
    void persistPatch({ status: statusSelect.value as TaskStatus });
  });
  prioritySelect.addEventListener('change', () => {
    void persistPatch({ priority: prioritySelect.value as Priority });
  });
  deadlineInput.addEventListener('change', () => {
    void persistPatch({ deadline: deadlineInput.value });
  });

  doneCheck.addEventListener('click', () => {
    if (!currentTask) return;
    const nextStatus: TaskStatus = currentTask.status === 'done' ? 'progress' : 'done';
    statusSelect.value = nextStatus;
    void persistPatch({ status: nextStatus });
  });

  subtaskList.addEventListener('click', (e) => {
    const check = (e.target as HTMLElement).closest<HTMLDivElement>('[data-action="toggle-subtask"]');
    if (!check || !currentTask) return;
    const item = check.closest<HTMLDivElement>('[data-subtask-id]');
    if (!item) return;
    const subtaskId = Number(item.dataset.subtaskId);
    const subtasks = currentTask.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, done: !s.done } : s,
    );
    void persistPatch({ subtasks });
  });
}

async function persistPatch(patch: Partial<Task>): Promise<void> {
  if (!currentTask) return;
  const optimistic = { ...currentTask, ...patch } as Task;
  currentTask = optimistic;
  renderSubtasks(optimistic.subtasks);
  syncDoneCheck(optimistic.status === 'done');
  try {
    const updated = await updateTask(taskId, patch);
    currentTask = updated;
  } catch (err) {
    alert(extractErrorMessage(err, 'Не удалось сохранить изменения'));
  }
}

function syncDoneCheck(isDone: boolean): void {
  doneCheck.classList.toggle('checked', isDone);
  checkIcon.style.display = isDone ? 'block' : 'none';
}

function showError(msg: string): void {
  taskLayout.style.display = 'none';
  taskError.style.display = 'block';
  taskError.textContent = msg;
}

function statusLabelLong(s: TaskStatus): string {
  return ({ todo: 'К выполнению', progress: 'В работе', review: 'На ревью', done: 'Выполнено' } as const)[s];
}

function priorityLabelLong(p: Priority): string {
  return ({ low: 'Низкий', medium: 'Средний', high: 'Высокий' } as const)[p];
}

function priorityEmoji(p: Priority): string {
  return ({ low: '🟢', medium: '🟡', high: '🔴' } as const)[p];
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function checkSvg(): string {
  return `<svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2 6 5 9 10 3"/></svg>`;
}

function renderUserCard(u: User): void {
  mustGet<HTMLDivElement>('#userAvatar').textContent = u.name.charAt(0).toUpperCase();
  mustGet<HTMLDivElement>('#userName').textContent = u.name;
  mustGet<HTMLDivElement>('#userRole').textContent = roleLabel(u.role);
}

function roleLabel(role: User['role']): string {
  return ({
    manager: 'Менеджер',
    developer: 'Разработчик',
    analyst: 'Аналитик',
    observer: 'Наблюдатель',
  } as const)[role];
}

function attachLogout(): void {
  mustGet<HTMLAnchorElement>('#logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}
