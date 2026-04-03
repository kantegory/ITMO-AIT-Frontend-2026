class RoutesApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => {
    return this.API({ url: '/routes' })
  }

  create = async (data) => {
    return this.API({
      method: 'POST',
      url: '/routes',
      data,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  delete = async (id) => {
    return this.API({
      method: 'DELETE',
      url: `/routes/${id}`
    })
  }
}

export default RoutesApi