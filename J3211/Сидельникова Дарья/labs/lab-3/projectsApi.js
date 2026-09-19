import api from './axios'

export async function getProjects() {
  const response = await api.get('/projects')
  return response.data
}

export async function getProjectById(projectId) {
  const response = await api.get(`/projects/${projectId}`)
  return response.data
}

export async function createProject(projectData) {
  const response = await api.post('/projects', projectData)
  return response.data
}