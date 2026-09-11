import http from './http'

export const commentsApi = {
  async getByProject(projectId) {
    const { data } = await http.get('/comments', { params: { projectId } })
    return data
  },

  async create(comment) {
    const { data } = await http.post('/comments', comment)
    return data
  },
}
