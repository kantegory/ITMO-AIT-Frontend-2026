import { defineStore } from 'pinia'
import { getProjects, getProjectById, createProject } from '@/api/projectsApi'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    currentProject: null,
    loading: false,
    error: ''
  }),

  actions: {
    async fetchProjects() {
      try {
        this.loading = true
        this.error = ''
        this.projects = await getProjects()
      } catch (error) {
        this.error = 'Ошибка загрузки проектов'
      } finally {
        this.loading = false
      }
    },

    async fetchProjectById(projectId) {
      try {
        this.loading = true
        this.error = ''
        this.currentProject = await getProjectById(projectId)
      } catch (error) {
        this.error = 'Ошибка загрузки проекта'
      } finally {
        this.loading = false
      }
    },

    async addProject(projectData) {
      const newProject = await createProject(projectData)
      this.projects.push(newProject)
      return newProject
    }
  }
})