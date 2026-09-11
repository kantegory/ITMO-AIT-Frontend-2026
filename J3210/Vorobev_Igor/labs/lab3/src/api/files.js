import http from './http'

export const filesApi = {
  async getByProject(projectId) {
    const { data } = await http.get('/files', { params: { projectId } })
    return data
  },

  async create(file) {
    const { data } = await http.post('/files', file)
    return data
  },

  async remove(id) {
    await http.delete(`/files/${id}`)
  },
}
