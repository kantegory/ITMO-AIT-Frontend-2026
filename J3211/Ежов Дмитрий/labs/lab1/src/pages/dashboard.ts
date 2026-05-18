import { logout } from '../api/auth';
import { extractErrorMessage } from '../api/client';
import { getActivity } from '../api/activity';
import { getProjects } from '../api/projects';
import { getTasks } from '../api/tasks';
import type { Activity, Project, Task, User } from '../types/domain';
import { requireAuth } from '../utils/guard';
import {
  escapeHtml,
  formatDate,
  formatRelative,
  mustGet,
  priorityLabel,
  statusLabel,
} from '../utils/render';

const user = requireAuth();

renderUserCard(user);
attachLogout();

void loadAll();

async function loadAll(): Promise<void> {
  try {
    const [tasks, projects, activity] = await Promise.all([
      getTasks({ assigneeId: user.id }),
      getProjects(),
      getActivity({ _sort: 'createdAt', _order: 'desc', _limit: 4 }),
    ]);

    renderGreeting(user, tasks);
    renderStats(tasks);
    renderTaskList(tasks.slice(0, 6), projects);
    renderProjects(projects);
    renderActivity(activity, tasks, projects);
  } catch (err) {
    const taskList = document.getElementById('taskList');
    if (taskList) {
      taskList.innerHTML = `<div style="padding:14px; color:#f87171;">${escapeHtml(extractErrorMessage(err, 'Не удалось загрузить данные'))}</div>`;
    }
  }
}

function renderUserCard(u: User): void {
  mustGet<HTMLDivElement>('#userAvatar').textContent = u.name.charAt(0).toUpperCase();
  mustGet<HTMLDivElement>('#userName').textContent = u.name;
  mustGet<HTMLDivElement>('#userRole').textContent = roleLabel(u.role);
}

function attachLogout(): void {
  mustGet<HTMLAnchorElement>('#logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

function renderGreeting(u: User, tasks: Task[]): void {
  const overdue = tasks.filter(isOverdue).length;
  const todayCount = tasks.filter((t) => t.status !== 'done').length;
  mustGet<HTMLHeadingElement>('#greeting').textContent = `Добрый день, ${u.name} 👋`;
  mustGet<HTMLParagraphElement>('#greetingSub').textContent =
    overdue > 0
      ? `У вас ${todayCount} активных задач и ${overdue} просроченных`
      : `У вас ${todayCount} активных задач`;
}

function renderStats(tasks: Task[]): void {
  const total = tasks.length;
  const inProgress = tasks.filter((t) => t.status === 'progress').length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const overdue = tasks.filter(isOverdue).length;
  mustGet<HTMLDivElement>('#statTotal').textContent = String(total);
  mustGet<HTMLDivElement>('#statInProgress').textContent = String(inProgress);
  mustGet<HTMLDivElement>('#statDone').textContent = String(done);
  mustGet<HTMLDivElement>('#statOverdue').textContent = String(overdue);
}

function renderTaskList(tasks: Task[], projects: Project[]): void {
  const list = mustGet<HTMLDivElement>('#taskList');
  if (tasks.length === 0) {
    list.innerHTML = `<div class="task-row" style="color:var(--text-muted); display:flex; justify-content:center;">Нет задач</div>`;
    return;
  }
  const projectsById = new Map(projects.map((p) => [p.id, p.name]));
  list.innerHTML = tasks.map((t) => taskRow(t, projectsById.get(t.projectId) ?? '')).join('');
}

function taskRow(t: Task, projectName: string): string {
  const overdue = isOverdue(t) ? 'overdue' : '';
  return `
    <a href="/task.html?id=${t.id}" class="task-row">
      <div>
        <div class="task-name">${escapeHtml(t.title)}</div>
        <div class="task-name task-project">${escapeHtml(projectName)}</div>
      </div>
      <span class="priority ${t.priority}"><span class="priority-dot"></span>${priorityLabel(t.priority)}</span>
      <span class="status-badge ${t.status}">${statusLabel(t.status)}</span>
      <span class="task-deadline ${overdue}">${formatDate(t.deadline)}</span>
    </a>`;
}

function renderProjects(projects: Project[]): void {
  const list = mustGet<HTMLDivElement>('#projectList');
  if (projects.length === 0) {
    list.innerHTML = `<div style="color:var(--text-muted); font-size:0.85rem;">Нет проектов</div>`;
    return;
  }
  list.innerHTML = projects
    .map(
      (p) => `
    <div class="project-item">
      <div class="project-row">
        <span class="project-name">${escapeHtml(p.name)}</span>
        <span class="project-pct">${p.progress}%</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width:${p.progress}%"></div>
      </div>
    </div>`,
    )
    .join('');
}

function renderActivity(activity: Activity[], tasks: Task[], projects: Project[]): void {
  const list = mustGet<HTMLDivElement>('#activityList');
  if (activity.length === 0) {
    list.innerHTML = `<div style="padding:10px 12px; color:var(--text-muted); font-size:0.8rem;">Нет недавней активности</div>`;
    return;
  }
  const tasksById = new Map(tasks.map((t) => [t.id, t.title]));
  const projectsById = new Map(projects.map((p) => [p.id, p.name]));
  list.innerHTML = activity
    .map((a) => {
      const targetName =
        a.targetType === 'task'
          ? tasksById.get(a.targetId) ?? `задача #${a.targetId}`
          : projectsById.get(a.targetId) ?? `проект #${a.targetId}`;
      return `
      <div class="activity-item">
        <div class="activity-icon">${activityIcon(a.action)}</div>
        <div>
          <div class="activity-text"><strong>Вы</strong> ${escapeHtml(actionVerb(a.action))} «${escapeHtml(targetName)}»</div>
          <div class="activity-time">${escapeHtml(formatRelative(a.createdAt))}</div>
        </div>
      </div>`;
    })
    .join('');
}

function isOverdue(t: Task): boolean {
  if (t.status === 'done') return false;
  return new Date(t.deadline).getTime() < Date.now();
}

function activityIcon(action: Activity['action']): string {
  const map: Record<Activity['action'], string> = {
    created: '✨',
    updated: '✏️',
    completed: '✅',
    commented: '💬',
    deleted: '🗑',
  };
  return map[action];
}

function actionVerb(action: Activity['action']): string {
  const map: Record<Activity['action'], string> = {
    created: 'создали',
    updated: 'обновили',
    completed: 'выполнили',
    commented: 'прокомментировали',
    deleted: 'удалили',
  };
  return map[action];
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

