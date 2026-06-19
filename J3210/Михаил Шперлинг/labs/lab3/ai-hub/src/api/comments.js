class CommentsApi {
  constructor(instance) {
    this.API = instance
  }

  getByModelId = async (modelId) => this.API({
    url: '/comments',
    params: { modelId }
  })

  create = async (data) => this.API({
    method: 'POST',
    url: '/comments',
    data,
    headers: { 'Content-Type': 'application/json' }
  })
}

export default CommentsApi
