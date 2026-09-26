import http from './http'

export const usersApi = {
  async findByEmail(email) {
    const { data } = await http.get('/users', { params: { email } })
    return data
  },

  async create(user) {
    const { data } = await http.post('/users', user)
    return data
  },
}
