import { defineStore } from 'pinia'
import { tPulseApi } from '../api/tPulseApi'

const priorityLabels = { high: 'Высокий', medium: 'Средний', low: 'Низкий' }
const priorityValues = { Высокий: 'high', Средний: 'medium', Низкий: 'low' }
const projectPresentation = {
  1: { progress: 68, color: 'yellow', icon: 'phone', members: ['+3', 'МС', 'АБ'] },
  2: { progress: 42, color: 'green', icon: 'window', members: ['+2', 'ИВ', 'АК'] },
  3: { progress: 18, color: 'orange', icon: 'chart', members: ['+1', 'АБ'] },
}

function formatDeadline(value) {
  if (!value) return 'Без срока'
  const date = new Date(`${value}T00:00:00`)
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })
    .format(date)
    .replace('.', '')
}

function presentTasks(tasks, projects) {
  const names = new Map(projects.map((project) => [project.id, project.name]))
  return tasks.map((task) => ({
    ...task,
    project: names.get(task.projectId) ?? 'Digital Lab',
    priority: priorityLabels[task.priority] ?? task.priority,
    time: task.status === 'done' ? 'Готово' : task.due,
    completed: task.status === 'done',
    meeting: task.type === 'Встреча',
  }))
}

export const useTasksStore = defineStore('tasks', {
  state: () => ({ tasks: [], projects: [], loading: false, error: '', initialized: false }),

  getters: {
    dashboardTasks: (state) => presentTasks(state.tasks.filter((task) => task.scope !== 'backlog'), state.projects),
    backlogTasks: (state) => presentTasks(state.tasks.filter((task) => task.scope === 'backlog'), state.projects),
    projectCards(state) {
      return state.projects.map((project, index) => {
        const presentation = projectPresentation[project.id] ?? {
          progress: 18,
          color: ['yellow', 'green', 'orange'][index % 3],
          icon: ['phone', 'window', 'chart'][index % 3],
          members: ['АБ'],
        }
        return {
          ...project,
          ...presentation,
          deadline: formatDeadline(project.deadline),
          status: project.status === 'progress' ? 'Активен' : 'Планирование',
        }
      })
    },
    stats(state) {
      return {
        total: state.tasks.length,
        active: state.tasks.filter((task) => task.status === 'progress').length,
        completed: state.tasks.filter((task) => task.status === 'done').length,
        overdue: state.tasks.filter((task) => task.status !== 'done' && task.priority === 'high').length,
      }
    },
  },

  actions: {
    async loadDashboard({ force = false } = {}) {
      if (this.initialized && !force) return
      this.loading = true
      this.error = ''
      try {
        const [tasks, projects] = await Promise.all([
          tPulseApi.getTasks({ _sort: 'id', _order: 'desc' }),
          tPulseApi.getProjects({ workspaceId: 1 }),
        ])
        this.tasks = tasks
        this.projects = projects
        this.initialized = true
      } catch (error) {
        this.error = error.message || 'Не удалось загрузить данные'
        throw error
      } finally {
        this.loading = false
      }
    },
    async createTask(formTask, options = {}) {
      const project = this.projects.find((item) => item.name === formTask.project)
      const created = await tPulseApi.createTask({
        projectId: project?.id ?? 1,
        userId: 1,
        title: formTask.title,
        type: options.type ?? 'Задача',
        status: options.status ?? 'todo',
        priority: priorityValues[formTask.priority] ?? 'medium',
        assignee: 'Александр Б.',
        assigneeCode: 'alex',
        initials: 'АБ',
        avatar: 'lime',
        due: formTask.time,
        labels: options.labels ?? [],
        points: options.points ?? 3,
        scope: options.scope ?? 'board',
      })
      this.tasks.unshift(created)
      return created
    },
    async updateTask(id, changes) {
      const updated = await tPulseApi.updateTask(id, changes)
      const task = this.tasks.find((item) => item.id === id)
      if (task) Object.assign(task, updated)
      return updated
    },
    async toggleTask(id) {
      const task = this.tasks.find((item) => item.id === id)
      if (!task) return null
      return this.updateTask(id, { status: task.status === 'done' ? 'todo' : 'done' })
    },
    async moveTask(id, status) {
      return this.updateTask(id, { status, scope: status === 'backlog' ? 'backlog' : 'board' })
    },
  },
})
