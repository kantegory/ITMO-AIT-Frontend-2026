class ArtifactsApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => this.API({ url: '/artifacts' })

  create = async (data) => this.API({ method: 'POST', url: '/artifacts', data })

  remove = async (id) => this.API({ method: 'DELETE', url: `/artifacts/${id}` })
}

export default ArtifactsApi
