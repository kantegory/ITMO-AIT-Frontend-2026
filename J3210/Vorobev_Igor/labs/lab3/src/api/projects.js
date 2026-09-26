import http from './http'

export const projectsApi = {
  async getAll() {
    const { data } = await http.get('/projects')
    return data
  },

  async getById(id) {
    const { data } = await http.get(`/projects/${id}`)
    return data
  },

  async create(project) {
    const { data } = await http.post('/projects', project)
    return data
  },

  async update(id, patch) {
    const { data } = await http.patch(`/projects/${id}`, patch)
    return data
  },
}
