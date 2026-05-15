class ExperimentsApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => this.API({ url: '/experiments' })

  create = async (data) => this.API({ method: 'POST', url: '/experiments', data })

  update = async (id, data) => this.API({ method: 'PATCH', url: `/experiments/${id}`, data })

  remove = async (id) => this.API({ method: 'DELETE', url: `/experiments/${id}` })
}

export default ExperimentsApi
