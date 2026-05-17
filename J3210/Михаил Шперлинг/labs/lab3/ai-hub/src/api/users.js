class UsersApi {
  constructor(instance) {
    this.API = instance
  }

  getByCredentials = async (email, password) => this.API({
    url: '/users',
    params: { email, password }
  })

  create = async (data) => this.API({
    method: 'POST',
    url: '/users',
    data,
    headers: { 'Content-Type': 'application/json' }
  })

  update = async (id, data) => this.API({
    method: 'PATCH',
    url: `/users/${id}`,
    data,
    headers: { 'Content-Type': 'application/json' }
  })
}

export default UsersApi
