class ModelsApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => this.API({ url: '/models' })

  getById = async (id) => this.API({ url: `/models/${id}` })

  create = async (data) => this.API({
    method: 'POST',
    url: '/models',
    data,
    headers: { 'Content-Type': 'application/json' }
  })

  update = async (id, data) => this.API({
    method: 'PATCH',
    url: `/models/${id}`,
    data,
    headers: { 'Content-Type': 'application/json' }
  })
}

export default ModelsApi
