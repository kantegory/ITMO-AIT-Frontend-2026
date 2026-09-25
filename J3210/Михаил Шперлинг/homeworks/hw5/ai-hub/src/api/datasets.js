class DatasetsApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => this.API({ url: '/datasets' })

  getById = async (id) => this.API({ url: `/datasets/${id}` })

  create = async (data) => this.API({
    method: 'POST',
    url: '/datasets',
    data,
    headers: { 'Content-Type': 'application/json' }
  })

  update = async (id, data) => this.API({
    method: 'PATCH',
    url: `/datasets/${id}`,
    data,
    headers: { 'Content-Type': 'application/json' }
  })
}

export default DatasetsApi
