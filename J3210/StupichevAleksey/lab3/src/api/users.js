import instance from '@/api/instance'

class UsersApi {
  constructor(api) {
    this.API = api
  }

  getById = (id) => this.API.get(`/users/${id}`)
  update = (id, data) => this.API.patch(`/users/${id}`, data)
}

export default new UsersApi(instance)
