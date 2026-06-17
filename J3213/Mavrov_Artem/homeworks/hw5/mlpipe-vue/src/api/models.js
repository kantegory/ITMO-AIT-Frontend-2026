class ModelsApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => this.API({ url: '/models' })

  create = async (data) => this.API({ method: 'POST', url: '/models', data })

  update = async (id, data) => this.API({ method: 'PATCH', url: `/models/${id}`, data })
}

export default ModelsApi
