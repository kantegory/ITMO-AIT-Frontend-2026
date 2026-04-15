import { defineStore } from 'pinia'
import { getUserTasks, getProjectTasks, createTask } from '@/api/tasksApi'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    projectTasks: [],
    loading: false,
    error: ''
  }),

  actions: {
    async fetchUserTasks(userId) {
      try {
        this.loading = true
        this.error = ''
        this.tasks = await getUserTasks(userId)
      } catch (error) {
        this.error = 'Ошибка загрузки задач'
      } finally {
        this.loading = false
      }
    },

    async fetchProjectTasks(projectId) {
      try {
        this.loading = true
        this.error = ''
        this.projectTasks = await getProjectTasks(projectId)
      } catch (error) {
        this.error = 'Ошибка загрузки задач проекта'
      } finally {
        this.loading = false
      }
    },

    async addTask(taskData) {
      const newTask = await createTask(taskData)
      this.tasks.push(newTask)
      this.projectTasks.push(newTask)
      return newTask
    }
  }
})