import { ref } from 'vue'
import {
  loadProjectsFromApi,
  loadProjectFromApi,
  createProjectInApi,
  saveProjectInApi,
  deleteProjectInApi,
  decorateProject,
} from '@/api/index.js'
import { getUserName } from '@/stores/auth.js'

const STORAGE_KEY = 'taskhub-projects'

const projects = ref(loadFromStorage())

function loadFromStorage() {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return []

  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveToStorage() {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(projects.value))
}

export function useProjects() {
  async function refreshProjects() {
    const list = await loadProjectsFromApi(getUserName())
    projects.value = list
    saveToStorage()
  }

  async function refreshProject(projectId) {
    const project = await loadProjectFromApi(projectId, getUserName())
    const idx = projects.value.findIndex((p) => p.id === projectId)

    if (idx !== -1) {
      projects.value[idx] = project
    } else {
      projects.value.unshift(project)
    }

    saveToStorage()
    return project
  }

  function getProject(projectId) {
    return projects.value.find((p) => p.id === projectId) || null
  }

  function updateProject(projectId, mutate) {
    const idx = projects.value.findIndex((p) => p.id === projectId)
    if (idx === -1) return

    const copy = JSON.parse(JSON.stringify(projects.value[idx]))
    mutate(copy)
    projects.value[idx] = copy
    saveToStorage()

    const stripped = { ...copy }
    delete stripped.role
    delete stripped.actions
    saveProjectInApi(projectId, stripped).catch(console.error)
  }

  function deleteProject(projectId) {
    projects.value = projects.value.filter((p) => p.id !== projectId)
    saveToStorage()
    deleteProjectInApi(projectId).catch(console.error)
  }

  async function createProject(projectData) {
    projects.value.unshift(decorateProject(projectData, getUserName()))
    saveToStorage()
    await createProjectInApi(projectData)
  }

  return {
    projects,
    refreshProjects,
    refreshProject,
    getProject,
    updateProject,
    deleteProject,
    createProject,
  }
}
