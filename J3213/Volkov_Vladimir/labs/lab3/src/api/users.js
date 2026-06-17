class UsersApi {
  constructor(instance) {
    this.API = instance
  }

  async findAll() {
    const response = await this.API.get('/users')
    return response.data
  }

  async findByEmail(email) {
    const response = await this.API.get(`/users?email=${encodeURIComponent(email)}`)
    return response.data
  }

  async login(email) {
    const response = await this.API.get(
      `/users?email=${encodeURIComponent(email)}`
    )
    return response.data
  }

  async create(data) {
    const response = await this.API.post('/users', data)
    return response.data
  }
}

export default UsersApi
