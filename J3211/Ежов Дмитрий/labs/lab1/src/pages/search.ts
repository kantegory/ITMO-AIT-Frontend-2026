import { logout } from '../api/auth';
import { extractErrorMessage } from '../api/client';
import { getProjects } from '../api/projects';
import { getTasks } from '../api/tasks';
import type { Priority, Project, Task, TaskStatus, User } from '../types/domain';
import type { TaskFilters } from '../types/api';
import { debounce } from '../utils/debounce';
import { requireAuth } from '../utils/guard';
import { initTheme } from '../utils/theme';
import {
  escapeHtml,
  formatDate,
  mustGet,
  priorityLabel,
  statusLabel,
} from '../utils/render';

initTheme();
const user = requireAuth();

renderUserCard(user);
attachLogout();

const searchInput = mustGet<HTMLInputElement>('#searchInput');
const filterStatus = mustGet<HTMLSelectElement>('#filterStatus');
const filterPriority = mustGet<HTMLSelectElement>('#filterPriority');
const filterProject = mustGet<HTMLSelectElement>('#filterProject');
const filterAssignee = mustGet<HTMLSelectElement>('#filterAssignee');
const sortSelect = mustGet<HTMLSelectElement>('#sortSelect');
const resetBtn = mustGet<HTMLButtonElement>('#resetFilters');
const taskGrid = mustGet<HTMLDivElement>('#taskGrid');
const countLabel = mustGet<HTMLElement>('#countLabel');
const emptyState = mustGet<HTMLDivElement>('#emptyState');
const loadingState = mustGet<HTMLDivElement>('#loadingState');

interface UiFilters {
  status: TaskStatus | '';
  priority: Priority | '';
  projectId: string;
  assigneeOnlyMe: boolean;
  query: string;
  sort: 'date-desc' | 'date-asc' | 'priority' | 'name';
}

const state: UiFilters = {
  status: '',
  priority: '',
  projectId: '',
  assigneeOnlyMe: false,
  query: '',
  sort: 'date-desc',
};

let projectsById = new Map<number, Project>();

void init();

async function init(): Promise<void> {
  try {
    const projects = await getProjects();
    projectsById = new Map(projects.map((p) => [p.id, p]));
    populateProjectFilter(projects);
  } catch (err) {
    showError(extractErrorMessage(err, 'Не удалось загрузить проекты'));
  }
  attachListeners();
  await applyFilters();
}

function populateProjectFilter(projects: Project[]): void {
  for (const p of projects) {
    const opt = document.createElement('option');
    opt.value = String(p.id);
    opt.textContent = p.name;
    filterProject.appendChild(opt);
  }
}

function attachListeners(): void {
  const onQueryInput = debounce(async () => {
    state.query = searchInput.value.trim();
    await applyFilters();
  }, 300);
  searchInput.addEventListener('input', onQueryInput);

  filterStatus.addEventListener('change', async () => {
    state.status = (filterStatus.value as TaskStatus) || '';
    await applyFilters();
  });
  filterPriority.addEventListener('change', async () => {
    state.priority = (filterPriority.value as Priority) || '';
    await applyFilters();
  });
  filterProject.addEventListener('change', async () => {
    state.projectId = filterProject.value;
    await applyFilters();
  });
  filterAssignee.addEventListener('change', async () => {
    state.assigneeOnlyMe = filterAssignee.value === 'me';
    await applyFilters();
  });
  sortSelect.addEventListener('change', async () => {
    state.sort = sortSelect.value as UiFilters['sort'];
    await applyFilters();
  });
  resetBtn.addEventListener('click', async () => {
    state.status = '';
    state.priority = '';
    state.projectId = '';
    state.assigneeOnlyMe = false;
    state.query = '';
    state.sort = 'date-desc';
    searchInput.value = '';
    filterStatus.value = '';
    filterPriority.value = '';
    filterProject.value = '';
    filterAssignee.value = '';
    sortSelect.value = 'date-desc';
    await applyFilters();
  });
}

async function applyFilters(): Promise<void> {
  loadingState.style.display = '';
  emptyState.style.display = 'none';
  taskGrid.innerHTML = '';

  const params: TaskFilters = {};
  if (state.status) params.status = state.status;
  if (state.priority) params.priority = state.priority;
  if (state.projectId) params.projectId = Number(state.projectId);
  if (state.assigneeOnlyMe) params.assigneeId = user.id;
  if (state.query) params.q = state.query;

  const sortMap: Record<UiFilters['sort'], { _sort: string; _order: 'asc' | 'desc' }> = {
    'date-desc': { _sort: 'createdAt', _order: 'desc' },
    'date-asc': { _sort: 'createdAt', _order: 'asc' },
    priority: { _sort: 'priority', _order: 'desc' },
    name: { _sort: 'title', _order: 'asc' },
  };
  Object.assign(params, sortMap[state.sort]);

  try {
    const tasks = await getTasks(params);
    loadingState.style.display = 'none';
    render(tasks);
  } catch (err) {
    loadingState.style.display = 'none';
    showError(extractErrorMessage(err, 'Не удалось загрузить задачи'));
  }
}

function render(tasks: Task[]): void {
  countLabel.textContent = String(tasks.length);
  if (tasks.length === 0) {
    emptyState.style.display = 'block';
    return;
  }
  emptyState.style.display = 'none';
  taskGrid.innerHTML = tasks.map(taskCard).join('');
}

function taskCard(t: Task): string {
  const project = projectsById.get(t.projectId);
  const overdue = t.status !== 'done' && new Date(t.deadline).getTime() < Date.now() ? 'overdue' : '';
  return `
    <a href="/task.html?id=${t.id}" class="task-card">
      <div>
        <div class="task-card-title">${escapeHtml(t.title)}</div>
        <div class="task-card-meta">
          <span class="meta-project"><span class="meta-dot"></span>${escapeHtml(project?.name ?? '—')}</span>
          <span>${escapeHtml(user.id === t.assigneeId ? user.name : `#${t.assigneeId}`)}</span>
        </div>
      </div>
      <span class="priority ${t.priority}"><span class="priority-dot"></span>${priorityLabel(t.priority)}</span>
      <span class="status-badge ${t.status}">${statusLabel(t.status)}</span>
      <span class="task-deadline ${overdue}">${formatDate(t.deadline)}</span>
      <button class="task-menu-btn" onclick="event.preventDefault()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
        </svg>
      </button>
    </a>`;
}

function showError(msg: string): void {
  taskGrid.innerHTML = `<div style="padding:20px; color:#f87171;">${escapeHtml(msg)}</div>`;
}

function renderUserCard(u: User): void {
  mustGet<HTMLDivElement>('#userAvatar').textContent = u.name.charAt(0).toUpperCase();
  mustGet<HTMLDivElement>('#userName').textContent = u.name;
  mustGet<HTMLDivElement>('#userRole').textContent = roleLabel(u.role);
}

function roleLabel(role: User['role']): string {
  const map: Record<User['role'], string> = {
    manager: 'Менеджер',
    developer: 'Разработчик',
    analyst: 'Аналитик',
    observer: 'Наблюдатель',
  };
  return map[role];
}

function attachLogout(): void {
  mustGet<HTMLAnchorElement>('#logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}
