import api from './axios'

export async function getUserTasks(userId) {
  const response = await api.get('/tasks', {
    params: { assigneeId: userId }
  })
  return response.data
}

export async function getProjectTasks(projectId) {
  const response = await api.get('/tasks', {
    params: { projectId }
  })
  return response.data
}

export async function createTask(taskData) {
  const response = await api.post('/tasks', taskData)
  return response.data
}