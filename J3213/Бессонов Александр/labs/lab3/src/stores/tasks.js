import { defineStore } from 'pinia'
import { tPulseApi } from '../api/tPulseApi'

const priorityLabels = {
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
}

const priorityValues = {
  Высокий: 'high',
  Средний: 'medium',
  Низкий: 'low',
}

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

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    projects: [],
    loading: false,
    error: '',
    initialized: false,
  }),

  getters: {
    dashboardTasks(state) {
      const projectNames = new Map(state.projects.map((project) => [project.id, project.name]))
      return state.tasks
        .filter((task) => task.scope !== 'backlog')
        .map((task) => ({
          ...task,
          project: projectNames.get(task.projectId) ?? 'Digital Lab',
          priority: priorityLabels[task.priority] ?? task.priority,
          time: task.status === 'done' ? 'Готово' : task.due,
          completed: task.status === 'done',
          meeting: task.type === 'Встреча',
        }))
    },

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
      const completed = state.tasks.filter((task) => task.status === 'done').length
      const active = state.tasks.filter((task) => task.status === 'progress').length
      const overdue = state.tasks.filter(
        (task) => task.status !== 'done' && task.priority === 'high',
      ).length
      return {
        total: state.tasks.length,
        active,
        completed,
        overdue,
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

    async createTask(formTask) {
      const project = this.projects.find((item) => item.name === formTask.project)
      const created = await tPulseApi.createTask({
        projectId: project?.id ?? 1,
        userId: 1,
        title: formTask.title,
        type: 'Задача',
        status: 'todo',
        priority: priorityValues[formTask.priority] ?? 'medium',
        assignee: 'Александр Б.',
        assigneeCode: 'alex',
        initials: 'АБ',
        avatar: 'lime',
        due: formTask.time,
        labels: [],
        points: 3,
        scope: 'board',
      })
      this.tasks.unshift(created)
      return created
    },

    async toggleTask(id) {
      const task = this.tasks.find((item) => item.id === id)
      if (!task) return null
      const updated = await tPulseApi.updateTask(id, {
        status: task.status === 'done' ? 'todo' : 'done',
      })
      Object.assign(task, updated)
      return updated
    },
  },
})
