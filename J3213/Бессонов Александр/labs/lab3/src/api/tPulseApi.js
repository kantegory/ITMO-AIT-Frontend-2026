import { http } from './http'

export const tPulseApi = {
  async login(email, password) {
    const { data } = await http.post('/login', { email, password })
    return data
  },
  async register(profile) {
    const { data } = await http.post('/register', profile)
    return data
  },
  async createWorkspace(workspace) {
    const { data } = await http.post('/workspaces', workspace)
    return data
  },
  async createProject(project) {
    const { data } = await http.post('/projects', project)
    return data
  },
  async updateUser(id, changes) {
    const { data } = await http.patch(`/users/${id}`, changes)
    return data
  },
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
  async createMember(member) {
    const { data } = await http.post('/members', member)
    return data
  },
  async updateMember(id, changes) {
    const { data } = await http.patch(`/members/${id}`, changes)
    return data
  },
  async getNotifications(params = {}) {
    const { data } = await http.get('/notifications', { params })
    return data
  },
  async updateNotification(id, changes) {
    const { data } = await http.patch(`/notifications/${id}`, changes)
    return data
  },
}
