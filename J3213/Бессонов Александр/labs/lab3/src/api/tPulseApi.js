import { http } from './http'

export const tPulseApi = {
  async getTasks(params = {}) {
    const { data } = await http.get('/tasks', { params })
    return data
  },
  async createTask(task) {
    const { data: created } = await http.post('/tasks', task)
    const { data } = await http.patch(`/tasks/${created.id}`, { key: `TP-${created.id}` })
    return data
  },
  async updateTask(id, changes) {
    const { data } = await http.patch(`/tasks/${id}`, changes)
    return data
  },
  async getProjects(params = {}) {
    const { data } = await http.get('/projects', { params })
    return data
  },
  async getMembers(params = {}) {
    const { data } = await http.get('/members', { params })
    return data
  },
}
